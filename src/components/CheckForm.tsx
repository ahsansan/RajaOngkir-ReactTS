import { API } from "../config/api";
import { useState, useEffect, FC, SyntheticEvent, ChangeEvent } from "react";
import ProvinceData from "../types/prov";
import CityData from "../types/city";
import { convertToRupiah } from "../utils/rupiah";

type CostData = {
  service: string;
  cost: any[];
};

const CheckForm: FC = () => {
  const [provinces, setProvinces] = useState<ProvinceData[]>([]);
  const [cities1, setCities1] = useState<CityData[]>([]);
  const [cities2, setCities2] = useState<CityData[]>([]);
  const [costList, setCostList] = useState<CostData[]>([]);
  const [asal, setAsal] = useState<string>("");
  const [tujuan, setTujuan] = useState<string>("");
  const [berat, setBerat] = useState<string>("");
  const [kurir, setKurir] = useState<string>("");
  const [keywordProvAsal, setKeywordProvAsal] = useState<string>("");
  const [suggestionsProvAsal, setSuggestionsProvAsal] = useState<ProvinceData[]>([]);
  const [keywordKotaAsal, setKeywordKotaAsal] = useState<string>("");
  const [suggestionsKotaAsal, setSuggestionsKotaAsal] = useState<CityData[]>([]);
  const [keywordProvTujuan, setKeywordProvTujuan] = useState<string>("");
  const [suggestionsProvTujuan, setSuggestionsProvTujuan] = useState<ProvinceData[]>([]);
  const [keywordKotaTujuan, setKeywordKotaTujuan] = useState<string>("");
  const [suggestionsKotaTujuan, setSuggestionsKotaTujuan] = useState<CityData[]>([]);

  useEffect(() => {
    getProvinces();
  }, []);

  const valBerat = (val: string): void => {
    setBerat(val);
  };
  const valKurir = (val: string): void => {
    setKurir(val);
  };

  const getProvinces = async () => {
    try {
      const resp = await API.get(`/provinsi`);
      setProvinces(resp.data.rajaongkir.results);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChangeProvinsiAsal = (event: ChangeEvent<HTMLInputElement>) => {
      const newKeyword = event.target.value;
      setKeywordProvAsal(newKeyword);
      const filteredSuggestions: any = provinces.filter((province: any) =>
        province.province.toLowerCase().includes(newKeyword.toLowerCase())
      );
      setSuggestionsProvAsal(filteredSuggestions);
      const foundProvinsi: any = provinces.find(item => item.province === event.target.value);
      const idDitemukan = foundProvinsi.province_id;
      getCity1(idDitemukan)
    };

    const handleInputChangeProvinsiTujuan = (event: ChangeEvent<HTMLInputElement>) => {
      const newKeyword = event.target.value;
      setKeywordProvTujuan(newKeyword);
      const filteredSuggestions: any = provinces.filter((province: any) =>
        province.province.toLowerCase().includes(newKeyword.toLowerCase())
      );
      setSuggestionsProvTujuan(filteredSuggestions);
      const foundProvinsi: any = provinces.find(item => item.province === event.target.value);
      const idDitemukan = foundProvinsi.province_id;
      getCity2(idDitemukan)
    };

  const getCity1 = async (idProv1: string) => {
    try {
      const resp = await API.get(`/kota/${idProv1}`);
      setCities1(resp.data.rajaongkir.results);
    } catch (err) {
      console.log(err);
    }
  };

  const getCity2 = async (idProv2: string) => {
    try {
      const resp = await API.get(`/kota/${idProv2}`);
      setCities2(resp.data.rajaongkir.results);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChangeKotaTujuan = (event: ChangeEvent<HTMLInputElement>) => {
    const newKeyword = event.target.value;
    setKeywordKotaTujuan(newKeyword);
    const filteredSuggestions: any = cities2.filter((item: any) =>
      item.city_name.toLowerCase().includes(newKeyword.toLowerCase())
    );
    setSuggestionsKotaTujuan(filteredSuggestions);
    const foundProvinsi: any = cities2.find(item => item.city_name === event.target.value);
    const idDitemukan = foundProvinsi.city_id;
    setTujuan(idDitemukan);
  };

  const handleInputChangeKotaAsal = (event: ChangeEvent<HTMLInputElement>) => {
    const newKeyword = event.target.value;
    setKeywordKotaAsal(newKeyword);
    const filteredSuggestions: any = cities1.filter((item: any) =>
      item.city_name.toLowerCase().includes(newKeyword.toLowerCase())
    );
    setSuggestionsKotaAsal(filteredSuggestions);
    const foundProvinsi: any = cities1.find(item => item.city_name === event.target.value);
    const idDitemukan = foundProvinsi.city_id;
    setAsal(idDitemukan)
  };

  const getCost = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const resp = await API.get(`ongkos/${asal}/${tujuan}/${berat}/${kurir}`);
      setCostList(resp.data.rajaongkir.results[0].costs);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-lg border shadow-lg bg-slate-50 mx-auto my-7 p-5 rounded-lg">
      <form className="mt-5">
        <hr className="border border-black" />
        <div className="w-full bg-slate-200 p-2">
          <p className="text-2xl text-red-900 font-semibold mt-1 mb-1">
            Kota Asal
          </p>
        </div>
        <hr className="border border-black mb-3" />
        <div>
          <label htmlFor="province-origin" className="label-section">Pilih Provinsi Asal</label>
              <input
                type="text"
                id="province-origin"
                value={keywordProvAsal}
                onChange={handleInputChangeProvinsiAsal}
                list="provinceOriginOptions"
                className="input-section"
                placeholder="-- Pilih Provinsi --"
              />
              <datalist id="provinceOriginOptions">
                {suggestionsProvAsal.map((province) => (
                  <option key={province.province_id} value={province.province} />
                ))}
              </datalist>
        </div>
        <div>
          <label htmlFor="city-origin" className="label-section">Pilih Kota Asal</label>
              <input
                type="text"
                id="city-origin"
                value={keywordKotaAsal}
                onChange={handleInputChangeKotaAsal}
                list="cityOriginOptions"
                className="input-section"
                placeholder="-- Pilih Kota --"
              />
              <datalist id="cityOriginOptions">
                {suggestionsKotaAsal.map((city) => (
                  <option key={city.city_id} value={city.city_name} />
                ))}
              </datalist>
        </div>
        <hr className="border border-black mt-5" />
        <div className="w-full bg-slate-200 p-2">
          <p className="text-2xl text-red-900 font-semibold mt-1 mb-1">
            Kota Tujuan
          </p>
        </div>
        <hr className="border border-black mb-3" />
        <div>
          <label htmlFor="province-to" className="label-section">Pilih Provinsi Tujuan</label>
              <input
                type="text"
                id="province-to"
                value={keywordProvTujuan}
                onChange={handleInputChangeProvinsiTujuan}
                list="provinceToOptions"
                className="input-section"
                placeholder="-- Pilih Provinsi --"
              />
              <datalist id="provinceToOptions">
                {suggestionsProvTujuan.map((province) => (
                  <option key={province.province_id} value={province.province} />
                ))}
              </datalist>
        </div>
        <div>
          <label htmlFor="city-to" className="label-section">Pilih Kota Tujuan</label>
              <input
                type="text"
                id="city-to"
                value={keywordKotaTujuan}
                onChange={handleInputChangeKotaTujuan}
                list="cityToOptions"
                className="input-section"
                placeholder="-- Pilih Kota --"
              />
              <datalist id="cityToOptions">
                {suggestionsKotaTujuan.map((city) => (
                  <option key={city.city_id} value={city.city_name} />
                ))}
              </datalist>
        </div>
        <label className="label-section" htmlFor="berat">
          Berat (gram)
        </label>
        <input
          type="number"
          name="berat"
          id="berat"
          onChange={(e) => valBerat(e.target.value)}
          placeholder="Berat kiriman"
          className="w-full h-9 border border-slate-500 rounded-lg mb-1 pl-2"
        />
        <label className="label-section" htmlFor="kurir">
          Kurir
        </label>
        <select
          id="kurir"
          name="kurir"
          onChange={(e) => valKurir(e.target.value)}
          className="w-full h-9 border border-slate-500 rounded-lg mb-5 pl-2"
        >
          <option value="">-- Pilih layanan --</option>
          <option value="jne">JNE</option>
          <option value="pos">POS Indonesia</option>
          <option value="tiki">TIKI</option>
        </select>
        <button
          onClick={getCost}
          className="text-lg bg-red-900 hover:bg-red-700 text-white p-3 rounded-xl mb-5"
        >
          Cek Ongkir
        </button>
      </form>

      <div className="mt-3">
        <div>
          {costList.map((item, index) => (
            <div
              key={index}
              className="p-3 bg-orange-200 text-black m-1 rounded-lg"
            >
              <div>
                <div className="flex flex-column justify-between">
                  <b className="text-red-900">{item.service}</b>
                  <i>{convertToRupiah(item.cost[0].value)}</i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckForm;
