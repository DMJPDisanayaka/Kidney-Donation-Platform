import User from '../models/User.js';
import { bloodCompatibility, calculateAge } from '../utils/bloodCompatibility.js';

const getRange = (rangeString) => {
  const [min, max] = String(rangeString || '').split('-').map(Number);
  return {
    minAge: Number.isFinite(min) ? min : 18,
    maxAge: Number.isFinite(max) ? max : 60
  };
};

const calculateMatchScore = ({ donor, patientLocation }) => {
  let score = 70;

  if (patientLocation && donor.location === patientLocation) {
    score += 15;
  }

  const donorAge = calculateAge(donor.date_of_birth);
  if (donorAge >= 25 && donorAge <= 45) {
    score += 10;
  }

  score += Math.floor(Math.random() * 6);
  return Math.min(score, 99);
};

// Finds compatible donor matches based on search criteria.
export const searchDonors = async (req, res) => {
  try {
    const { bloodType, location, ageRange } = req.body;

    if (!bloodType) {
      return res.status(400).json({ success: false, message: 'Patient blood type is required' });
    }

    const compatibleDonorBloodTypes = bloodCompatibility[bloodType];

    if (!compatibleDonorBloodTypes) {
      return res.status(400).json({ success: false, message: 'Invalid blood type' });
    }

    const candidateDonors = await User.find({
      user_type: 'donor',
      is_active: true,
      blood_type: { $in: compatibleDonorBloodTypes }
    }).lean();

    const { minAge, maxAge } = getRange(ageRange);

    const matches = candidateDonors
      .map((donor) => ({ donor, age: calculateAge(donor.date_of_birth) }))
      .filter(({ donor, age }) => age >= minAge && age <= maxAge)
      .filter(({ donor }) => !location || donor.location === location)
      .map(({ donor, age }) => ({
        id: donor._id,
        name: `Anonymous Donor ${String(donor._id).slice(-4)}`,
        age,
        bloodType: donor.blood_type,
        location: donor.location,
        status: 'Available',
        matchScore: calculateMatchScore({ donor, patientLocation: location })
      }))
      .sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({
      success: true,
      data: {
        count: matches.length,
        matches
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Donor search failed', error: error.message });
  }
};
