import Image from 'next/image';
import { useState, useEffect } from 'react';
import React from 'react';

const PerformansListe = ({ performansListesi, kapsamaBirimData, error }) => {
  if (error) return <div>{JSON.stringify(error)}</div>;
  //SWR veya ReactQuery kullanılarak state management geliştirilebilir.
  const [performansListe, setPerformansListe] = useState(performansListesi);
  const [kapsamaBirimListe, setKapsamaBirimListe] = useState(kapsamaBirimData);
  const [modalElements, setModalElements] = useState({
    addModal: '',
    updateModal: '',
  });
  const [performansEkle, setPerformansEkle] = useState({
    IDPerformans: '',
    IDKullaniciTip: '',
    HazirlayanIDIliski: '',
    PerformansAdi: '',
    Aciklama: '',
    IDKullanici: '',
    HazirlayanGurup: '',
    HazirlayanAd: '',
    OzelAlanGurubu: 'Gurup',
    OzelAlanID: kapsamaBirimListe[0].ID,
    OzelAlanAd: kapsamaBirimListe[0].Adi,
    Durum: 0,
    OlusturmaTarihi: new Date().toLocaleDateString(),
  });

  useEffect(() => {
    setModalElements({
      addModal: document.getElementById('addModal'),
      updateModal: document.getElementById('updateModal'),
    });
  }, []);

  useEffect(() => {
    document.getElementById('UpdateOzelAlanGurubu').value =
      performansEkle.OzelAlanGurubu;
  }, [performansEkle]);

  const handleOpenAddModal = async () => {
    document.getElementById('datePicker').valueAsDate = new Date();
    await updateKapsamaBirimListe('Gurup');
    setPerformansEkle({
      IDPerformans: '',
      OzelAlanGurubu: 'Gurup',
      IDKullaniciTip: '',
      HazirlayanIDIliski: '',
      PerformansAdi: '',
      Aciklama: '',
      IDKullanici: '',
      HazirlayanAd: '',
      HazirlayanGurup: '',
      OzelAlanID: '',
      OzelAlanAd: 'DEMO',
      Durum: 0,
      OlusturmaTarihi: new Date().toLocaleDateString(),
    });
    document.getElementById('OzelAlanGurubu').value = 'Gurup';
    modalElements.addModal.style.display = 'block';
  };

  const handleCloseAddModal = () => {
    modalElements.addModal.style.display = 'none';
  };

  const handleKapsamaAlaniChange = async (e) => {
    try {
      const apiPath = process.env.API_PATH;
      const response = await fetch(
        `${apiPath}api/aIk/aPerformansListe?action=${e.target.value}`
      );
      const result = await response.json();
      setKapsamaBirimListe(result);
      document.getElementById('datePicker').valueAsDate = new Date();
      setPerformansEkle({
        IDPerformans: performansEkle.IDPerformans,
        OzelAlanGurubu: e.target[e.target.selectedIndex].text,
        IDKullaniciTip: '',
        HazirlayanIDIliski: '',
        PerformansAdi: '',
        Aciklama: '',
        IDKullanici: '',
        HazirlayanAd: '',
        HazirlayanGurup: '',
        OzelAlanID: result[0].ID,
        OzelAlanAd: result[0].Adi,
        Durum: 0,
        OlusturmaTarihi: new Date().toLocaleDateString(),
      });
    } catch (err) {
      console.log('err=>', err);
    }
  };

  const handleKapsamaBirimChange = (e) => {
    if (e.target.name === 'kapsama-birim-selector') {
      setPerformansEkle((prev) => {
        return {
          ...prev,
          OzelAlanID: e.target.value,
          OzelAlanAd: e.target[e.target.selectedIndex].text,
        };
      });
    } else if (e.target.name === 'Durum') {
      setPerformansEkle((prev) => {
        return { ...prev, [e.target.name]: e.target.checked };
      });
    } else {
      setPerformansEkle((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });
    }
  };

  const handleFormSubmit = async (e) => {
    const apiPath = process.env.API_PATH;
    const response = await fetch(
      `${apiPath}api/aIk/aPerformansListe?action=addPerformance`,
      {
        method: 'POST',
        body: JSON.stringify(performansEkle),
      }
    );
    await response.json();
  };

  const handleUpdateFormSubmit = async (e) => {
    const apiPath = process.env.API_PATH;
    const response = await fetch(
      `${apiPath}api/aIk/aPerformansListe?action=updatePerformance`,
      {
        method: 'POST',
        body: JSON.stringify(performansEkle),
      }
    );
    await response.json();
  };

  const handleOpenUpdateModal = async (e) => {
    await updateKapsamaBirimListe(
      performansListe[e.target.getAttribute('index')].OzelAlanGurubu
    );
    setPerformansEkle(performansListe[e.target.getAttribute('index')]);
    document.getElementById('updateDatePicker').valueAsDate = new Date();
    modalElements.updateModal.style.display = 'block';
  };

  const updateKapsamaBirimListe = async (kapsamaAlani) => {
    const apiPath = process.env.API_PATH;
    const response = await fetch(
      `${apiPath}api/aIk/aPerformansListe?action=${kapsamaAlani}`
    );
    const result = await response.json();
    setKapsamaBirimListe(result);
  };

  const handleCloseUpdateModal = () => {
    modalElements.updateModal.style.display = 'none';
  };

  const handleDeletePerformance = async (e) => {
    window.location.reload();
    const apiPath = process.env.API_PATH;
    const response = await fetch(
      `${apiPath}api/aIk/aPerformansListe?action=deletePerformance`,
      {
        method: 'POST',
        body: JSON.stringify({IDPerformans:performansListe[e.target.getAttribute('index')].IDPerformans}),
      }
    );
    await response.json();
  };

  return (
    <div>
      <p className='text-gray-500 font-bold text-lg'>Performans Tanımlama</p>
      <div className='grid grid-cols-[5%_5%_6%_6%_5%_auto_auto_auto_auto_auto_auto] sm:text-[7px] md:text-[10px] lg:text-[12px] xl:text-[15px]'>
        <div className='grid-title'>Sil</div>
        <div className='grid-title'>Düzenle</div>
        <div className='grid-title'>Değerlemeci Listesi</div>
        <div className='grid-title'>Değerlenen Listesi</div>
        <div className='grid-title'>Ödül Ceza</div>
        <div className='grid-title'>Performans Adı</div>
        <div className='grid-title'>Hazırlayan</div>
        <div className='grid-title'>Alan Gurubu</div>
        <div className='grid-title'>Alan Adı</div>
        <div className='grid-title'>Oluşturma Tarihi</div>
        <div className='grid-title'>Aktif</div>
        {performansListe.length > 0 &&
          performansListe.map((item, idx) => {
            return (
              <React.Fragment key={idx}>
                <div className='grid-item justify-center'>
                  <div className='relative sm:w-4 sm:h-4 md:w-6 lg:w-8 md:h-6 lg:h-8'>
                    <Image
                      onClick={(e) => handleDeletePerformance(e)}
                      sizes='(max-width: 640) 16px, (max-width: 768px) 24px, (max-width: 1024px) 32px'
                      fill
                      alt='sil'
                      src='/assets/sil.png'
                      index={idx}
                    />
                  </div>
                </div>
                <div className='grid-item justify-center'>
                  <div className='relative sm:w-4 sm:h-4 md:w-6 lg:w-8 md:h-6 lg:h-8'>
                    <Image
                      onClick={(e) => handleOpenUpdateModal(e)}
                      sizes='(max-width: 640) 16px, (max-width: 768px) 24px, (max-width: 1024px) 32px'
                      fill
                      alt='duzenle'
                      src='/assets/duzenle.png'
                      index={idx}
                    />
                  </div>
                </div>
                <div className='grid-item justify-center'>
                  <div className='relative sm:w-4 sm:h-4 md:w-6 lg:w-8 md:h-6 lg:h-8'>
                    <Image
                      sizes='(max-width: 640) 16px, (max-width: 768px) 24px, (max-width: 1024px) 32px'
                      fill
                      alt='degerlendirme-listesi'
                      src='/assets/degerlendirme-listesi.png'
                    />
                  </div>
                </div>
                <div className='grid-item justify-center'>
                  <div className='relative sm:w-4 sm:h-4 md:w-6 lg:w-8 md:h-6 lg:h-8'>
                    <Image
                      sizes='(max-width: 640px) 16px, (max-width: 768px) 24px, (max-width: 1024px) 32px)'
                      fill
                      alt='degerlenen-listesi'
                      src='/assets/degerlenen-listesi.png'
                    />
                  </div>
                </div>
                <div className='grid-item justify-center'>
                  <div className='relative sm:w-4 sm:h-4 md:w-6 lg:w-8 md:h-6 lg:h-8'>
                    <Image
                      sizes='(max-width: 640px) 16px, (max-width: 768px) 24px, (max-width: 1024px) 32px)'
                      fill
                      alt='odul-ceza'
                      src='/assets/odul-ceza.png'
                    />
                  </div>
                </div>
                <div className='grid-item text-red-800'>
                  {item.PerformansAdi}
                </div>
                <div className='grid-item'>{item.HazirlayanAd}</div>
                <div className='grid-item'>{item.OzelAlanGurubu}</div>
                <div className='grid-item'>{item.OzelAlanAd}</div>
                <div className='grid-item'>
                  {new Date(item.OlusturmaTarihi).toLocaleDateString()}
                </div>
                <div className='grid-item justify-center'>
                  <input type='checkbox' checked={item.Durum} disabled />
                </div>
              </React.Fragment>
            );
          })}
      </div>
      <div className='button-container'>
        <button
          className='bg-gray-200 px-6 py-2 border border-black hover:bg-gray-400 transition-colors font-semibold'
          type='button'
          id='addModalButton'
          onClick={handleOpenAddModal}
        >
          EKLE
        </button>
        <button
          className='bg-gray-200 px-6 py-2 border border-black hover:bg-gray-400 transition-colors font-semibold'
          type='button'
        >
          KAPAT
        </button>
      </div>

      {/* Modal */}
      <div id='addModal' className='modal'>
        <div className='modal-content'>
          <form onSubmit={handleFormSubmit}>
            <div className='h-full grid grid-rows-[10%_10%_10%_auto_10%_10%_10%] grid-cols-[20%_auto] p-3 gap-1'>
              <label className='flex items-center'>Kapsama Alanı</label>
              <div className='flex flex-row'>
                <p className='pr-10 flex items-center'>:</p>
                <select
                  className='border border-black w-full'
                  name='OzelAlanGurubu'
                  id='OzelAlanGurubu'
                  onChange={(e) => handleKapsamaAlaniChange(e)}
                  defaultValue={'Gurup'}
                >
                  <option name='Gurup' value='Gurup'>
                    Gurup
                  </option>
                  <option name='Şirket' value='Şirket'>
                    Şirket
                  </option>
                  <option name='Şube' value='Şube'>
                    Şube
                  </option>
                </select>
              </div>
              <label className='flex items-center'>Kapsama Birim</label>
              <div className='flex flex-row'>
                <p className='pr-10 flex items-center'>:</p>
                <select
                  className='border border-black w-full'
                  name='kapsama-birim-selector'
                  id='kapsama-birim-selector'
                  onChange={(e) => handleKapsamaBirimChange(e)}
                >
                  {kapsamaBirimListe.length > 0 &&
                    kapsamaBirimListe.map((item, idx) => {
                      return (
                        <option key={idx} value={item.ID}>
                          {item.Adi}
                        </option>
                      );
                    })}
                </select>
              </div>
              <label className='flex items-center'>Performans Adı</label>
              <div className='flex flex-row'>
                <p className='pr-10  flex items-center'>:</p>
                <input
                  name='PerformansAdi'
                  onChange={(e) => handleKapsamaBirimChange(e)}
                  className='border border-black w-full ps-1'
                  type='text'
                  value={performansEkle.PerformansAdi}
                />
              </div>
              <label className='flex items-center'>Açıklama</label>
              <div className='flex flex-row'>
                <p className='pr-10 flex items-center'>:</p>
                <input
                  onChange={(e) => handleKapsamaBirimChange(e)}
                  name='Aciklama'
                  className='border border-black w-full pb-16 ps-1'
                  type='text'
                  value={performansEkle.Aciklama}
                />
              </div>
              <label className='flex items-center'>Aktif</label>
              <div className='flex flex-row'>
                <p className='pr-10 flex items-center'>:</p>
                <input
                  onChange={(e) => handleKapsamaBirimChange(e)}
                  name='Durum'
                  className='justify-self-start border border-black'
                  type='checkbox'
                  checked={performansEkle.Durum}
                />
              </div>
              <label className='flex items-center'>Oluşturma Tarihi</label>
              <div className='flex flex-row'>
                <p className='pr-10 flex items-center'>:</p>
                <input
                  onChange={(e) => handleKapsamaBirimChange(e)}
                  name='OlusturmaTarihi'
                  className='border border-black w-72'
                  type='date'
                  id='datePicker'
                  valueasdate={performansEkle.OlusturmaTarihi}
                />
              </div>
              <div className='flex flex-row gap-2 col-start-2 pl-11'>
                <button
                  className='bg-gray-200 px-28 border border-black hover:bg-gray-400 transition-colors font-semibold'
                  type='submit'
                >
                  İLERİ {'>>'}
                </button>
                <button
                  className='bg-gray-200 px-28 border border-black hover:bg-gray-400 transition-colors font-semibold'
                  type='button'
                  onClick={handleCloseAddModal}
                >
                  GERİ
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* UpdateModal */}
      <div id='updateModal' className='modal'>
        <div className='modal-content'>
          <form onSubmit={handleUpdateFormSubmit}>
            <div className='h-full grid grid-rows-[10%_10%_10%_auto_10%_10%_10%] grid-cols-[20%_auto] p-3 gap-1'>
              <label className='flex items-center'>Kapsama Alanı</label>
              <div className='flex flex-row'>
                <p className='pr-10 flex items-center'>:</p>
                <select
                  className='border border-black w-full'
                  name='OzelAlanGurubu'
                  id='UpdateOzelAlanGurubu'
                  onChange={(e) => handleKapsamaAlaniChange(e)}
                >
                  <option name='Gurup' value='Gurup'>
                    Gurup
                  </option>
                  <option name='Şirket' value='Şirket'>
                    Şirket
                  </option>
                  <option name='Şube' value='Şube'>
                    Şube
                  </option>
                </select>
              </div>
              <label className='flex items-center'>Kapsama Birim</label>
              <div className='flex flex-row'>
                <p className='pr-10 flex items-center'>:</p>
                <select
                  className='border border-black w-full'
                  name='kapsama-birim-selector'
                  id='update-kapsama-birim-selector'
                  onChange={(e) => handleKapsamaBirimChange(e)}
                  value={performansEkle.OzelAlanAd}
                >
                  {kapsamaBirimListe.length > 0 &&
                    kapsamaBirimListe.map((item, idx) => {
                      return (
                        <option key={idx} value={item.ID}>
                          {item.Adi}
                        </option>
                      );
                    })}
                </select>
              </div>
              <label className='flex items-center'>Performans Adı</label>
              <div className='flex flex-row'>
                <p className='pr-10  flex items-center'>:</p>
                <input
                  name='PerformansAdi'
                  onChange={(e) => handleKapsamaBirimChange(e)}
                  className='border border-black w-full ps-1'
                  type='text'
                  value={performansEkle.PerformansAdi}
                />
              </div>
              <label className='flex items-center'>Açıklama</label>
              <div className='flex flex-row'>
                <p className='pr-10 flex items-center'>:</p>
                <input
                  onChange={(e) => handleKapsamaBirimChange(e)}
                  name='Aciklama'
                  className='border border-black w-full pb-16 ps-1'
                  type='textArea'
                  value={performansEkle.Aciklama}
                />
              </div>
              <label className='flex items-center'>Aktif</label>
              <div className='flex flex-row'>
                <p className='pr-10 flex items-center'>:</p>
                <input
                  onChange={(e) => handleKapsamaBirimChange(e)}
                  name='Durum'
                  className='justify-self-start border border-black'
                  type='checkbox'
                  checked={performansEkle.Durum}
                />
              </div>
              <label className='flex items-center'>Oluşturma Tarihi</label>
              <div className='flex flex-row'>
                <p className='pr-10 flex items-center'>:</p>
                <input
                  onChange={(e) => handleKapsamaBirimChange(e)}
                  name='OlusturmaTarihi'
                  className='border border-black w-72'
                  type='date'
                  id='updateDatePicker'
                  valueasdate={performansEkle.OlusturmaTarihi}
                />
              </div>
              <div className='flex flex-row gap-2 col-start-2 pl-11'>
                <button
                  className='bg-gray-200 px-28 border border-black hover:bg-gray-400 transition-colors font-semibold'
                  type='submit'
                >
                  İLERİ &gt;&gt;
                </button>
                <button
                  className='bg-gray-200 px-28 border border-black hover:bg-gray-400 transition-colors font-semibold'
                  type='button'
                  onClick={handleCloseUpdateModal}
                >
                  GERİ
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const getPerformansListesi = async (apiPath) => {
  const response = await fetch(
    `${apiPath}api/aIk/aPerformansListe?action=getPerformanceList`
  );
  const result = await response.json();
  return result;
};

const getKapsamaBirim = async (apiPath) => {
  const response = await fetch(
    `${apiPath}api/aIk/aPerformansListe?action=Gurup`
  );
  const result = await response.json();
  return result;
};

export const getServerSideProps = async () => {
  const apiPath = process.env.API_PATH;
  try {
    const performansListesi = await getPerformansListesi(apiPath);
    const kapsamaBirim = await getKapsamaBirim(apiPath);
    return {
      props: {
        performansListesi: performansListesi,
        kapsamaBirimData: kapsamaBirim,
      },
    };
  } catch (err) {
    console.error('Error fetching data: ', err);
    return { props: { error: err.message } };
  }
};

export default PerformansListe;
