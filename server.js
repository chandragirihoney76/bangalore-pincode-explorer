const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const fallback = {
  '560001': ['Bangalore GPO', 'Vasanth Nagar', 'Raj Bhavan'],
  '560002': ['Bangalore City', 'Chamarajpet', 'Cottonpet'],
  '560003': ['Malleswaram', 'Malleswaram West'],
  '560004': ['Basavanagudi', 'Gavipuram Extension'],
  '560005': ['Fraser Town', 'Cox Town'],
  '560008': ['Indiranagar', 'Domlur'],
  '560010': ['Rajajinagar', 'Industrial Town'],
  '560011': ['Jayanagar', 'Tilak Nagar'],
  '560017': ['Vimanapura', 'HAL Airport Road'],
  '560025': ['Shanthinagar', 'Langford Town'],
  '560029': ['Adugodi', 'Koramangala'],
  '560034': ['Koramangala', 'St. Bed'],
  '560038': ['Indiranagar', 'Defence Colony'],
  '560040': ['Vijayanagar', 'RPC Layout'],
  '560043': ['Banaswadi', 'Horamavu'],
  '560048': ['Mahadevapura', 'Doddanekkundi'],
  '560066': ['Whitefield', 'Kundalahalli'],
  '560068': ['Bommanahalli', 'Hongasandra'],
  '560076': ['Bannerghatta Road', 'Arekere'],
  '560078': ['JP Nagar', 'Puttenahalli'],
  '560085': ['Banashankari', 'Kathriguppe'],
  '560100': ['Electronic City', 'Neeladri Road'],
  '560102': ['HSR Layout', 'Agara'],
  '560103': ['Bellandur', 'Kadubeesanahalli'],
  '560037': ['Marathahalli', 'Brookefield']
};

function normalize(rows) {
  return rows.map((office) => ({
    pincode: office.Pincode,
    name: office.Name,
    branchType: office.BranchType,
    deliveryStatus: office.DeliveryStatus,
    district: office.District,
    division: office.Division,
    region: office.Region,
    state: office.State,
    circle: office.Circle
  }));
}

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'bangalore-pincode-explorer' }));

app.get('/api/pincodes/:pincode', async (req, res) => {
  const pincode = String(req.params.pincode).trim();
  if (!/^56\d{4}$/.test(pincode)) {
    return res.status(400).json({ message: 'Enter a valid 6-digit Bangalore pincode starting with 56.' });
  }

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    if (!response.ok) throw new Error('Postal API unavailable');
    const data = await response.json();
    const offices = data?.[0]?.PostOffice || [];

    const bangalore = offices.filter((o) => /Bangalore|Bengaluru/i.test(`${o.District} ${o.Name}`));
    if (bangalore.length) {
      return res.json({ source: 'India Post API', count: bangalore.length, results: normalize(bangalore) });
    }

    if (fallback[pincode]) {
      return res.json({
        source: 'Fallback dataset', count: fallback[pincode].length,
        results: fallback[pincode].map((name) => ({ pincode, name, state: 'Karnataka', district: 'Bangalore Urban' }))
      });
    }

    return res.status(404).json({ message: 'No Bangalore area found for this pincode.' });
  } catch (error) {
    if (fallback[pincode]) {
      return res.json({
        source: 'Fallback dataset', count: fallback[pincode].length,
        results: fallback[pincode].map((name) => ({ pincode, name, state: 'Karnataka', district: 'Bangalore Urban' }))
      });
    }
    return res.status(503).json({ message: 'Postal service is temporarily unavailable. Please try again.' });
  }
});

app.get('/api/pincodes', (_req, res) => {
  const results = Object.entries(fallback).flatMap(([pincode, areas]) =>
    areas.map((name) => ({ pincode, name, state: 'Karnataka', district: 'Bangalore Urban' }))
  );
  res.json({ count: results.length, results });
});

app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`Bangalore Pincode Explorer running on http://localhost:${PORT}`));
