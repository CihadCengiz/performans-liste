import { config } from '@/db/db';
import sql from 'mssql';

const handler = async (req, res) => {
  try {
    await sql.connect(config);
    const idGroup = '9';
    if (req.query.action === 'getPerformanceList') {
      const result =
        await sql.query`SELECT * FROM Performans ORDER BY OlusturmaTarihi DESC`;
      res.status(200).json(result.recordset);
      sql.close();
    } else if (req.query.action === 'Gurup') {
      const result =
        await sql.query`SELECT IDGurup ID, GurupAdi Adi from Gurup WHERE IDGurup=${idGroup}`;
      res.status(200).json(result.recordset);
      sql.close();
    } else if (req.query.action === 'Şirket') {
      const result =
        await sql.query`SELECT DISTINCT IDSirket ID, SirketAdi Adi from vSirket_Sube WHERE IDGurup=${idGroup}`;
      res.status(200).json(result.recordset);
      sql.close();
    } else if (req.query.action === 'Şube') {
      const result =
        await sql.query`SELECT DISTINCT IDSube ID, SubeAdi Adi from vSirket_Sube WHERE IDGurup=${idGroup}`;
      res.status(200).json(result.recordset);
      sql.close();
    } else if (req.query.action === 'addPerformance' && req.method === 'POST') {
      const performansEkle = JSON.parse(req.body);
      const request = new sql.Request();
      request.input('IDKullaniciTip', sql.BigInt, 1);
      request.input('HazirlayanIDIliski', sql.BigInt, 1);
      request.input('PerformansAdi', sql.VarChar, performansEkle.PerformansAdi);
      request.input('Aciklama', sql.VarChar, performansEkle.Aciklama);
      request.input('IDKullanici', sql.BigInt, 1);
      request.input('HazirlayanGurup', sql.VarChar, 'Gurup');
      request.input('HazirlayanAd', sql.VarChar, 'Cihad Cengiz');
      request.input(
        'OzelAlanGurubu',
        sql.VarChar,
        performansEkle.OzelAlanGurubu
      );
      request.input('OzelAlanID', sql.BigInt, parseInt(idGroup));
      request.input('OzelAlanAd', sql.VarChar, performansEkle.OzelAlanAd);
      request.input('Durum', sql.Bit, performansEkle.Durum);
      request.input(
        'OlusturmaTarihi',
        sql.DateTime,
        performansEkle.OlusturmaTarihi
      );
      request.execute('Performans_Insert', (err, result) => {
        if (err) {
          return res.status(400).send(err);
        }
        res.status(200).json(result);
        sql.close();
      });
    } else if (
      req.query.action === 'updatePerformance' &&
      req.method === 'POST'
    ) {
      const performansEkle = JSON.parse(req.body);
      const request = new sql.Request();
      request.input('IDPerformans', sql.BigInt, performansEkle.IDPerformans);
      request.input('IDKullaniciTip', sql.BigInt, 1);
      request.input('HazirlayanIDIliski', sql.BigInt, 1);
      request.input('PerformansAdi', sql.VarChar, performansEkle.PerformansAdi);
      request.input('Aciklama', sql.VarChar, performansEkle.Aciklama);
      request.input('IDKullanici', sql.BigInt, 1);
      request.input('HazirlayanGurup', sql.VarChar, 'Gurup');
      request.input('HazirlayanAd', sql.VarChar, 'Cihad Cengiz');
      request.input(
        'OzelAlanGurubu',
        sql.VarChar,
        performansEkle.OzelAlanGurubu
      );
      request.input('OzelAlanID', sql.BigInt, parseInt(idGroup));
      request.input('OzelAlanAd', sql.VarChar, performansEkle.OzelAlanAd);
      request.input('Durum', sql.Bit, performansEkle.Durum);
      request.input(
        'OlusturmaTarihi',
        sql.DateTime,
        performansEkle.OlusturmaTarihi
      );
      request.execute('Performans_UpdateByIDPerformans', (err, result) => {
        if (err) {
          return res.status(400).send(err);
        }
        res.status(200).json(result);
        sql.close();
      });
    } else if (
      req.query.action === 'deletePerformance' &&
      req.method === 'POST'
    ) {
      const performansEkle = JSON.parse(req.body);
      const request = new sql.Request();
      request.input('IDPerformans', sql.BigInt, performansEkle.IDPerformans);
      request.execute('Performans_DeleteByIDPerformans', (err, result) => {
        if (err) {
          return res.status(400).send(err);
        }
        res.status(200).json(result);
        sql.close();
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    sql.close();
  }
};

export default handler;
