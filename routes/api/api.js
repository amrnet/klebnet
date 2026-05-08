import csv from 'csv-parser';
import express from 'express';
import fs from 'fs';
import connectDB, { getCollectionCountWithTimeout, getDataWithTimeout } from '../../config/db.js';

const router = express.Router();

const dbAndCollectionNames = {
  kpneumo: { dbName: 'klebnet', collectionName: 'klebnet' },
  unr: { dbName: 'unr', collectionName: 'unr' },
};

const readCsvFallback = (filePath, res) => {
  const results = [];
  fs.createReadStream(filePath)
    .on('error', err => {
      console.error(`Error reading fallback file ${filePath}:`, err);
      return res.json([]);
    })
    .pipe(csv())
    .on('data', data => results.push(data))
    .on('end', () => {
      return res.json(results);
    });
};

router.get('/getDataForKpneumo', async function (req, res) {
  const dbAndCollection = dbAndCollectionNames['kpneumo'];
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5000;
    const skip = (page - 1) * limit;
    const query = { 'dashboard view': 'include', GENOTYPE: { $ne: null } };
    const projection = {
      GENOTYPE: 1,
      COUNTRY_ONLY: 1,
      DATE: 1,
      TRAVEL: 1,
      PMID: 1,
      ESBL_category: 1,
      Carbapenems_category: 1,
      cgST: 1,
      Sublineage: 1,
      AGly_acquired: 1,
      Bla_Carb_acquired: 1,
      Bla_ESBL_acquired: 1,
      Bla_ESBL_inhR_acquired: 1,
      Flq_acquired: 1,
      Flq_mutations: 1,
      Col_acquired: 1,
      Col_mutations: 1,
      Fcyn_acquired: 1,
      Phe_acquired: 1,
      Sul_acquired: 1,
      Tet_acquired: 1,
      Tgc_acquired: 1,
      Tmt_acquired: 1,
      SHV_mutations: 1,
      Omp_mutations: 1,
      num_resistance_classes: 1,
      virulence_score: 1,
      O_locus: 1,
      K_locus: 1,
      O_type: 1,
      NAME: 1,
      _id: 0,
    };

    const client = await connectDB();
    const collection = client.db(dbAndCollection.dbName).collection(dbAndCollection.collectionName);

    const [totalDocuments, result] = await Promise.all([
      page === 1 ? collection.countDocuments(query) : Promise.resolve(null),
      collection.find(query).project(projection).skip(skip).limit(limit).toArray(),
    ]);

    console.log(`Found ${result.length} documents for Kpneumo (page ${page}).`);
    return res.json({
      data: result,
      pagination: {
        page,
        limit,
        ...(totalDocuments !== null && { totalDocuments, totalPages: Math.ceil(totalDocuments / limit) }),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/getUNR', async function (_req, res) {
  const dbAndCollection = dbAndCollectionNames['unr'];
  try {
    const result = await getDataWithTimeout(dbAndCollection.dbName, dbAndCollection.collectionName, {});

    console.log(`Found ${result.length} documents for UNR.`);
    return res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/getCollectionCounts', async function (_req, res) {
  try {
    const countPromises = Object.entries(dbAndCollectionNames).map(([, { dbName, collectionName }]) => {
      return getCollectionCountWithTimeout(dbName, collectionName, {
        'dashboard view': { $regex: /^include$/, $options: 'i' },
        $or: [{ GENOTYPE: { $ne: null } }, { ST: { $ne: null } }, { GENOTYPE: { $ne: null } }],
      });
    });

    const counts = await Promise.all(countPromises);

    const result = Object.keys(dbAndCollectionNames).reduce((acc, key, index) => {
      acc[key] = counts[index].toLocaleString('fi-FI');
      return acc;
    }, {});

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
