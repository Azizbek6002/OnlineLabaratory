/* ============================================================
   Virtual Kimyo Laboratoriyasi — 118 element ma'lumotlari
   Ma'lumotlar: IUPAC atom massalari va umumiy kimyoviy manbalar.
   Superog'ir elementlar uchun ba'zi qiymatlar taxminiydir.
   ============================================================ */
(function (global) {
    "use strict";

    const E = (n, s, name, mass, cat, state, discovered, desc, uses, extra) => Object.assign({
        n, s, name, mass, cat, state, discovered, desc, uses
    }, extra || {});

    const ELEMENTS = [
        E(1, "H", "Vodorod", "1.008", "nonmetal", "Gaz", "1766", "Koinotdagi eng ko'p tarqalgan element; yulduzlar va suvning asosiy tarkibiy qismi.", "Yoqilg'i, ammiak sintezi va kimyo sanoatida keng qo'llaniladi.", { density: "0.00009 g/cm³", melt: "-259.16°C", boil: "-252.87°C", en: 2.20 }),
        E(2, "He", "Geliy", "4.0026", "noble", "Gaz", "1868", "Nobial gaz, eng past qaynash haroratiga ega; geliy yadrolari alfa zarrachalardir.", "Kriogenika, sharlar va tibbiy MRI apparatlarida.", { density: "0.00018 g/cm³", melt: "-272.20°C", boil: "-268.93°C" }),
        E(3, "Li", "Litiy", "6.94", "alkali", "Qattiq", "1817", "Eng yengil metall; suv bilan reaksiyaga kirishib vodorod ajratadi.", "Litiy-ion batareyalar, qotishmalar va psixiatriyada.", { density: "0.534 g/cm³", melt: "180.54°C", boil: "1342°C", en: 0.98 }),
        E(4, "Be", "Berilliy", "9.0122", "alkaline-earth", "Qattiq", "1798", "Yengil va qattiq metall; zaharli chang hosil qiladi.", "Aerokosmik qotishmalar va rentgen oynalarida.", { density: "1.85 g/cm³", melt: "1287°C", boil: "2469°C", en: 1.57 }),
        E(5, "B", "Bor", "10.81", "metalloid", "Qattiq", "1808", "Metalloid; bor kislotasi va boridlarning asosidir.", "Shisha, keramika, yarimo'tkazgichlar va qishloq xo'jaligida.", { density: "2.34 g/cm³", melt: "2076°C", boil: "3927°C", en: 2.04 }),
        E(6, "C", "Uglerod", "12.011", "nonmetal", "Qattiq", "Qadimdan ma'lum", "Hayotning asosiy elementi; olmos, grafit va fulleren shakllarida uchraydi.", "Po'lat ishlab chiqarish, yoqilg'i va organik kimyo.", { density: "2.267 g/cm³", melt: "3550°C", boil: "4027°C", en: 2.55 }),
        E(7, "N", "Azot", "14.007", "nonmetal", "Gaz", "1772", "Havoning 78% ini tashkil qiluvchi inert gaz.", "O'g'itlar, portlovchi moddalar va sovutish tizimlarida.", { density: "0.00125 g/cm³", melt: "-210.0°C", boil: "-195.8°C", en: 3.04 }),
        E(8, "O", "Kislorod", "15.999", "nonmetal", "Gaz", "1774", "Hayot uchun zarur gaz; havoning 21% ini tashkil qiladi.", "Nafas olish, metallurgiya va tibbiyotda.", { density: "0.00143 g/cm³", melt: "-218.79°C", boil: "-182.95°C", en: 3.44 }),
        E(9, "F", "Ftor", "18.998", "halogen", "Gaz", "1886", "Eng faol galogen; deyarli barcha elementlar bilan reaksiyaga kirishadi.", "Tish pastasi, floropolimerlar va sovutgichlarda.", { density: "0.00170 g/cm³", melt: "-219.67°C", boil: "-188.11°C", en: 3.98 }),
        E(10, "Ne", "Neon", "20.180", "noble", "Gaz", "1898", "Nobial gaz; elektr tokida qizil-to'q sariq nur chiqaradi.", "Reklama lampalari va lazerlarda.", { density: "0.00090 g/cm³", melt: "-248.59°C", boil: "-246.08°C" }),
        E(11, "Na", "Natriy", "22.990", "alkali", "Qattiq", "1807", "Ishqoriy metall; suv bilan kuchli reaksiyaga kirishadi.", "Osh tuzi, sovun va metallurgiyada.", { density: "0.968 g/cm³", melt: "97.72°C", boil: "883°C", en: 0.93 }),
        E(12, "Mg", "Magniy", "24.305", "alkaline-earth", "Qattiq", "1755", "Yengil kumushrang metall; yonishda juda yorqin nur chiqaradi.", "Qotishmalar, pirotexnika va tibbiyotda.", { density: "1.738 g/cm³", melt: "650°C", boil: "1090°C", en: 1.31 }),
        E(13, "Al", "Alyuminiy", "26.982", "post-transition", "Qattiq", "1825", "Yengil, korroziyaga chidamli metall; yer qobig'ida eng ko'p tarqalgan metall.", "Aviatsiya, qurilish va oziq-ovqat qadoqlashda.", { density: "2.70 g/cm³", melt: "660.32°C", boil: "2519°C", en: 1.61 }),
        E(14, "Si", "Kremniy", "28.085", "metalloid", "Qattiq", "1824", "Metalloid; yer qobig'idagi ikkinchi eng ko'p element.", "Yarimo'tkazgichlar, shisha va quyosh panellarida.", { density: "2.329 g/cm³", melt: "1414°C", boil: "3265°C", en: 1.90 }),
        E(15, "P", "Fosfor", "30.974", "nonmetal", "Qattiq", "1669", "Nometall; oq va qizil allotropik shakllari mavjud.", "O'g'itlar, gugurt va detergenlarda.", { density: "1.823 g/cm³", melt: "44.15°C", boil: "280.5°C", en: 2.19 }),
        E(16, "S", "Oltingugurt", "32.06", "nonmetal", "Qattiq", "Qadimdan ma'lum", "Sariq nometall; vulqonlarda va sulfid minerallarida uchraydi.", "Sulfat kislota, o'g'it va vulkanizatsiyada.", { density: "2.07 g/cm³", melt: "115.21°C", boil: "444.72°C", en: 2.58 }),
        E(17, "Cl", "Xlor", "35.45", "halogen", "Gaz", "1774", "Sarg'ish-yashil zaharli gaz; kuchli oksidlovchi.", "Suv tozalash, dezinfeksiya va polimerlarda.", { density: "0.00321 g/cm³", melt: "-101.5°C", boil: "-34.04°C", en: 3.16 }),
        E(18, "Ar", "Argon", "39.948", "noble", "Gaz", "1894", "Havodagi eng ko'p nobial gaz; kimyoviy inert.", "Payvandlash, lampalar va himoya muhitida.", { density: "0.00178 g/cm³", melt: "-189.34°C", boil: "-185.85°C" }),
        E(19, "K", "Kaliy", "39.098", "alkali", "Qattiq", "1807", "Ishqoriy metall; o'simliklar o'sishi uchun zarur.", "O'g'itlar, sovun va shisha ishlab chiqarishda.", { density: "0.862 g/cm³", melt: "63.5°C", boil: "759°C", en: 0.82 }),
        E(20, "Ca", "Kaltsiy", "40.078", "alkaline-earth", "Qattiq", "1808", "Ishqoriy-yer metalli; suyak va tishlarning asosiy tarkibiy qismi.", "Qurilish, metallurgiya va tibbiyotda.", { density: "1.55 g/cm³", melt: "842°C", boil: "1484°C", en: 1.00 }),
        E(21, "Sc", "Skandiy", "44.956", "transition", "Qattiq", "1879", "Yengil o'tish metali; alyuminiy qotishmalarini mustahkamlaydi.", "Aerokosmik qotishmalar va lampalarda.", { density: "2.985 g/cm³", melt: "1541°C", boil: "2836°C", en: 1.36 }),
        E(22, "Ti", "Titan", "47.867", "transition", "Qattiq", "1791", "Yengil, mustahkam va korroziyaga chidamli metall.", "Aviatsiya, tibbiy implantlar va bo'yoqlarda.", { density: "4.506 g/cm³", melt: "1668°C", boil: "3287°C", en: 1.54 }),
        E(23, "V", "Vanadiy", "50.942", "transition", "Qattiq", "1801", "O'tish metali; po'latning mustahkamligini oshiradi.", "Po'lat qotishmalari va katalizatorlarda.", { density: "6.11 g/cm³", melt: "1910°C", boil: "3407°C", en: 1.63 }),
        E(24, "Cr", "Xrom", "51.996", "transition", "Qattiq", "1797", "Qattiq, korroziyaga chidamli metall; xrom qoplamalar beradi.", "Zanglamas po'lat, qoplamalar va bo'yoqlarda.", { density: "7.19 g/cm³", melt: "1907°C", boil: "2671°C", en: 1.66 }),
        E(25, "Mn", "Marganets", "54.938", "transition", "Qattiq", "1774", "O'tish metali; po'lat ishlab chiqarishda muhim.", "Po'lat, batareyalar va qotishmalarda.", { density: "7.21 g/cm³", melt: "1246°C", boil: "2061°C", en: 1.55 }),
        E(26, "Fe", "Temir", "55.845", "transition", "Qattiq", "Qadimdan ma'lum", "Eng ko'p ishlatiladigan metall; yer yadrosining asosiy qismi.", "Po'lat, qurilish va mashinasozlikda.", { density: "7.874 g/cm³", melt: "1538°C", boil: "2862°C", en: 1.83 }),
        E(27, "Co", "Kobalt", "58.933", "transition", "Qattiq", "1735", "Magnit xossalarga ega o'tish metali.", "Batareyalar, qotishmalar va pigmentlarda.", { density: "8.90 g/cm³", melt: "1495°C", boil: "2927°C", en: 1.88 }),
        E(28, "Ni", "Nikel", "58.693", "transition", "Qattiq", "1751", "Korroziyaga chidamli, magnit metall.", "Zanglamas po'lat, batareyalar va qoplamalarda.", { density: "8.908 g/cm³", melt: "1455°C", boil: "2913°C", en: 1.91 }),
        E(29, "Cu", "Mis", "63.546", "transition", "Qattiq", "Qadimdan ma'lum", "Yaxshi elektr va issiqlik o'tkazuvchi qizil metall.", "Elektr simlari, quvurlar va qotishmalarda.", { density: "8.96 g/cm³", melt: "1084.62°C", boil: "2562°C", en: 1.90 }),
        E(30, "Zn", "Rux", "65.38", "transition", "Qattiq", "1746", "Ko'kish-kulrang metall; korroziyadan himoya qiladi.", "Galvanizatsiya, batareyalar va qotishmalarda.", { density: "7.14 g/cm³", melt: "419.53°C", boil: "907°C", en: 1.65 }),
        E(31, "Ga", "Galliy", "69.723", "post-transition", "Qattiq", "1875", "Past haroratda eriydigan yumshoq metall.", "Yarimo'tkazgichlar, LED va termometrlarda.", { density: "5.91 g/cm³", melt: "29.76°C", boil: "2204°C", en: 1.81 }),
        E(32, "Ge", "Germaniy", "72.630", "metalloid", "Qattiq", "1886", "Metalloid; yarimo'tkazgich xossalariga ega.", "Tolali optika, infraqizil optika va elektronikada.", { density: "5.323 g/cm³", melt: "938.25°C", boil: "2833°C", en: 2.01 }),
        E(33, "As", "Margumush", "74.922", "metalloid", "Qattiq", "Qadimdan ma'lum", "Zaharli metalloid; sulfid minerallarida uchraydi.", "Yarimo'tkazgichlar, pestitsidlar va qotishmalarda.", { density: "5.727 g/cm³", melt: "817°C", boil: "614°C", en: 2.18 }),
        E(34, "Se", "Selen", "78.971", "nonmetal", "Qattiq", "1817", "Nometall; fotoelektr xossalariga ega.", "Shisha, fotoelementlar va oziq-ovqat qo'shimchalarida.", { density: "4.81 g/cm³", melt: "221°C", boil: "685°C", en: 2.55 }),
        E(35, "Br", "Brom", "79.904", "halogen", "Suyuq", "1826", "Qizil-qo'ng'ir suyuq galogen; zaharli va uchuvchan.", "Olovni sekinlashtiruvchi moddalar, dori va fotografiyada.", { density: "3.12 g/cm³", melt: "-7.2°C", boil: "58.8°C", en: 2.96 }),
        E(36, "Kr", "Kripton", "83.798", "noble", "Gaz", "1898", "Nobial gaz; elektr razryadida yorqin nur chiqaradi.", "Lampalar, lazerlar va izolyatsiyada.", { density: "0.00373 g/cm³", melt: "-157.36°C", boil: "-153.22°C", en: 3.00 }),
        E(37, "Rb", "Rubidiy", "85.468", "alkali", "Qattiq", "1861", "Yumshoq ishqoriy metall; juda faol.", "Atom soatlari, fotoelementlar va tadqiqotlarda.", { density: "1.532 g/cm³", melt: "39.31°C", boil: "688°C", en: 0.82 }),
        E(38, "Sr", "Stronsiy", "87.62", "alkaline-earth", "Qattiq", "1790", "Ishqoriy-yer metalli; olovni qizil rangga bo'yaydi.", "Pirotexnika, keramika va tibbiyotda.", { density: "2.64 g/cm³", melt: "777°C", boil: "1382°C", en: 0.95 }),
        E(39, "Y", "Ittriy", "88.906", "transition", "Qattiq", "1794", "O'tish metali; noyob yer elementlari guruhiga yaqin.", "LED, supero'tkazgichlar va qotishmalarda.", { density: "4.472 g/cm³", melt: "1526°C", boil: "3336°C", en: 1.22 }),
        E(40, "Zr", "Zirkoniy", "91.224", "transition", "Qattiq", "1789", "Korroziyaga chidamli, neytronlarni yutuvchi metall.", "Yadro reaktorlari, keramika va zargarlikda.", { density: "6.52 g/cm³", melt: "1855°C", boil: "4409°C", en: 1.33 }),
        E(41, "Nb", "Niobiy", "92.906", "transition", "Qattiq", "1801", "O'tish metali; yuqori haroratga chidamli.", "Supero'tkazgichlar, po'lat va raketa detallarida.", { density: "8.57 g/cm³", melt: "2477°C", boil: "4744°C", en: 1.6 }),
        E(42, "Mo", "Molibden", "95.95", "transition", "Qattiq", "1778", "Yuqori haroratga chidamli o'tish metali.", "Po'lat qotishmalari, katalizatorlar va elektrodlarda.", { density: "10.28 g/cm³", melt: "2623°C", boil: "4639°C", en: 2.16 }),
        E(43, "Tc", "Texnetsiy", "98", "transition", "Qattiq", "1937", "Birinchi sun'iy yo'l bilan olingan element; radioaktiv.", "Tibbiy diagnostika va tadqiqotlarda.", { density: "11.5 g/cm³", melt: "2157°C", boil: "4265°C", en: 1.9, synthetic: true }),
        E(44, "Ru", "Ruteniy", "101.07", "transition", "Qattiq", "1844", "Platina guruhidagi qattiq metall.", "Katalizatorlar, elektronika va qotishmalarda.", { density: "12.45 g/cm³", melt: "2334°C", boil: "4150°C", en: 2.2 }),
        E(45, "Rh", "Rodiy", "102.91", "transition", "Qattiq", "1803", "Platina guruhidagi juda qimmatbaho metall.", "Avtomobil katalizatorlari va zargarlikda.", { density: "12.41 g/cm³", melt: "1964°C", boil: "3695°C", en: 2.28 }),
        E(46, "Pd", "Palladiy", "106.42", "transition", "Qattiq", "1803", "Platina guruhidagi metall; vodorodni yutadi.", "Katalizatorlar, elektronika va tibbiyotda.", { density: "12.023 g/cm³", melt: "1554.9°C", boil: "2963°C", en: 2.20 }),
        E(47, "Ag", "Kumush", "107.87", "transition", "Qattiq", "Qadimdan ma'lum", "Eng yaxshi elektr va issiqlik o'tkazuvchi metall.", "Zargarlik, elektronika va fotografiyada.", { density: "10.49 g/cm³", melt: "961.78°C", boil: "2162°C", en: 1.93 }),
        E(48, "Cd", "Kadmiy", "112.41", "transition", "Qattiq", "1817", "Zaharli, yumshoq o'tish metali.", "Batareyalar, pigmentlar va qoplamalarda.", { density: "8.65 g/cm³", melt: "321.07°C", boil: "767°C", en: 1.69 }),
        E(49, "In", "Indiy", "114.82", "post-transition", "Qattiq", "1863", "Yumshoq, kumushrang metall; ITO qoplamalarida ishlatiladi.", "Sensorli ekranlar, LED va qotishmalarda.", { density: "7.31 g/cm³", melt: "156.6°C", boil: "2072°C", en: 1.78 }),
        E(50, "Sn", "Qalay", "118.71", "post-transition", "Qattiq", "Qadimdan ma'lum", "Yumshoq metall; qalay qotishmalarining asosi.", "Lehim, qalay qoplamalar va bronzada.", { density: "7.31 g/cm³", melt: "231.93°C", boil: "2602°C", en: 1.96 }),
        E(51, "Sb", "Surma", "121.76", "metalloid", "Qattiq", "Qadimdan ma'lum", "Metalloid; olovni sekinlashtiradi.", "Olovga chidamli materiallar, qotishmalar va batareyalarda.", { density: "6.697 g/cm³", melt: "630.63°C", boil: "1587°C", en: 2.05 }),
        E(52, "Te", "Tellur", "127.60", "metalloid", "Qattiq", "1782", "Metalloid; yarimo'tkazgich xossalariga ega.", "Quyosh panellari, qotishmalar va termoelementlarda.", { density: "6.24 g/cm³", melt: "449.51°C", boil: "988°C", en: 2.1 }),
        E(53, "I", "Yod", "126.90", "halogen", "Qattiq", "1811", "Binafsha rangli bug' hosil qiluvchi galogen.", "Antiseptiklar, oziq-ovqat qo'shimchalari va fotografiyada.", { density: "4.93 g/cm³", melt: "113.7°C", boil: "184.3°C", en: 2.66 }),
        E(54, "Xe", "Ksenon", "131.29", "noble", "Gaz", "1898", "Og'ir nobial gaz; yorqin chiroq chiqaradi.", "Yoritish lampalari, lazerlar va ion dvigatellarida.", { density: "0.00589 g/cm³", melt: "-111.75°C", boil: "-108.12°C", en: 2.6 }),
        E(55, "Cs", "Seziy", "132.91", "alkali", "Qattiq", "1860", "Eng faol ishqoriy metall; past haroratda eriydi.", "Atom soatlari, fotoelementlar va tadqiqotlarda.", { density: "1.93 g/cm³", melt: "28.44°C", boil: "671°C", en: 0.79 }),
        E(56, "Ba", "Bariy", "137.33", "alkaline-earth", "Qattiq", "1808", "Ishqoriy-yer metalli; olovni yashil rangga bo'yaydi.", "Rentgen kontrasti, pirotexnika va shisha ishlab chiqarishda.", { density: "3.51 g/cm³", melt: "727°C", boil: "1897°C", en: 0.89 }),
        E(57, "La", "Lantan", "138.91", "lanthanide", "Qattiq", "1839", "Lantanidlar guruhining birinchi elementi.", "Optik shisha, katalizatorlar va batareyalarda.", { density: "6.162 g/cm³", melt: "920°C", boil: "3464°C", en: 1.10 }),
        E(58, "Ce", "Seriy", "140.12", "lanthanide", "Qattiq", "1803", "Eng ko'p tarqalgan noyob yer elementi.", "Katalizatorlar, shisha va abrazivlarda.", { density: "6.77 g/cm³", melt: "795°C", boil: "3443°C", en: 1.12 }),
        E(59, "Pr", "Prazeodim", "140.91", "lanthanide", "Qattiq", "1885", "Lantanid; magnit va optik xossalarga ega.", "Kuchli magnitlar, lazerlar va shisha bo'yashda.", { density: "6.77 g/cm³", melt: "935°C", boil: "3520°C", en: 1.13 }),
        E(60, "Nd", "Neodim", "144.24", "lanthanide", "Qattiq", "1885", "Lantanid; eng kuchli doimiy magnitlarda ishlatiladi.", "NdFeB magnitlari, lazerlar va elektronikada.", { density: "7.01 g/cm³", melt: "1024°C", boil: "3074°C", en: 1.14 }),
        E(61, "Pm", "Prometiy", "145", "lanthanide", "Qattiq", "1945", "Radioaktiv lantanid; tabiatda juda kam uchraydi.", "Yadro batareyalari va tadqiqotlarda.", { density: "7.26 g/cm³", melt: "1042°C", boil: "3000°C", en: 1.13, synthetic: true }),
        E(62, "Sm", "Samariy", "150.36", "lanthanide", "Qattiq", "1879", "Lantanid; magnit xossalari bilan ajralib turadi.", "Doimiy magnitlar, katalizatorlar va yadro reaktorlarida.", { density: "7.52 g/cm³", melt: "1072°C", boil: "1794°C", en: 1.17 }),
        E(63, "Eu", "Yevropiy", "151.96", "lanthanide", "Qattiq", "1901", "Lantanid; fosforlarda qizil va ko'k nur chiqaradi.", "LED, televizor ekranlari va banknotlarni himoyalashda.", { density: "5.244 g/cm³", melt: "826°C", boil: "1529°C", en: 1.2 }),
        E(64, "Gd", "Gadoliniy", "157.25", "lanthanide", "Qattiq", "1880", "Lantanid; magnit va neytron yutish xossalariga ega.", "MRI kontrasti, magnitlar va yadro reaktorlarida.", { density: "7.90 g/cm³", melt: "1312°C", boil: "3273°C", en: 1.20 }),
        E(65, "Tb", "Terbiy", "158.93", "lanthanide", "Qattiq", "1843", "Lantanid; yashil fosforlar uchun ishlatiladi.", "LED, magnitlar va tadqiqotlarda.", { density: "8.23 g/cm³", melt: "1356°C", boil: "3230°C", en: 1.2 }),
        E(66, "Dy", "Disproziy", "162.50", "lanthanide", "Qattiq", "1886", "Lantanid; yuqori haroratli magnitlarda qo'llaniladi.", "Doimiy magnitlar, lazerlar va yadro reaktorlarida.", { density: "8.54 g/cm³", melt: "1407°C", boil: "2567°C", en: 1.22 }),
        E(67, "Ho", "Golmiy", "164.93", "lanthanide", "Qattiq", "1878", "Lantanid; kuchli magnit xossalariga ega.", "Lazerlar, magnitlar va yadro texnologiyalarida.", { density: "8.79 g/cm³", melt: "1461°C", boil: "2720°C", en: 1.23 }),
        E(68, "Er", "Erbiy", "167.26", "lanthanide", "Qattiq", "1843", "Lantanid; infraqizil nurlarni yutadi.", "Tolali optika, lazerlar va shisha bo'yashda.", { density: "9.066 g/cm³", melt: "1529°C", boil: "2868°C", en: 1.24 }),
        E(69, "Tm", "Tuliy", "168.93", "lanthanide", "Qattiq", "1879", "Lantanid; noyob va qimmatbaho element.", "Portativ rentgen apparatlari va lazerlarda.", { density: "9.32 g/cm³", melt: "1545°C", boil: "1950°C", en: 1.25 }),
        E(70, "Yb", "Iterbiy", "173.05", "lanthanide", "Qattiq", "1878", "Lantanid; past haroratli tadqiqotlarda ishlatiladi.", "Atom soatlari, lazerlar va qotishmalarda.", { density: "6.90 g/cm³", melt: "824°C", boil: "1196°C", en: 1.1 }),
        E(71, "Lu", "Lutesiy", "174.97", "lanthanide", "Qattiq", "1907", "Lantanidlar guruhining eng og'ir elementi.", "Katalizatorlar, PET skanerlari va qotishmalarda.", { density: "9.841 g/cm³", melt: "1652°C", boil: "3402°C", en: 1.27 }),
        E(72, "Hf", "Gafniy", "178.49", "transition", "Qattiq", "1923", "O'tish metali; neytronlarni yutadi.", "Yadro reaktorlari, supero'tkazgichlar va qoplamalarda.", { density: "13.31 g/cm³", melt: "2233°C", boil: "4603°C", en: 1.3 }),
        E(73, "Ta", "Tantal", "180.95", "transition", "Qattiq", "1802", "Juda qattiq, korroziyaga chidamli metall.", "Elektronika, tibbiy implantlar va qotishmalarda.", { density: "16.69 g/cm³", melt: "3017°C", boil: "5458°C", en: 1.5 }),
        E(74, "W", "Volfram", "183.84", "transition", "Qattiq", "1783", "Eng yuqori erish haroratiga ega metall.", "Lampalar, kesish asboblari va qotishmalarda.", { density: "19.25 g/cm³", melt: "3422°C", boil: "5555°C", en: 2.36 }),
        E(75, "Re", "Reniy", "186.21", "transition", "Qattiq", "1925", "Juda yuqori haroratga chidamli noyob metall.", "Reaktiv dvigatellar, katalizatorlar va termoparlarda.", { density: "21.02 g/cm³", melt: "3186°C", boil: "5596°C", en: 1.9 }),
        E(76, "Os", "Osmiy", "190.23", "transition", "Qattiq", "1803", "Eng zich tabiiy element; juda qattiq.", "Qalam uchlari, elektr kontaktlari va tadqiqotlarda.", { density: "22.59 g/cm³", melt: "3033°C", boil: "5012°C", en: 2.2 }),
        E(77, "Ir", "Iridiy", "192.22", "transition", "Qattiq", "1803", "Korroziyaga eng chidamli metallardan biri.", "Shamdonlar, elektrodlar va kosmik texnologiyalarda.", { density: "22.56 g/cm³", melt: "2466°C", boil: "4428°C", en: 2.20 }),
        E(78, "Pt", "Platina", "195.08", "transition", "Qattiq", "1735", "Qimmatbaho, korroziyaga chidamli katalizator metall.", "Zargarlik, katalizatorlar va tibbiyotda.", { density: "21.45 g/cm³", melt: "1768.3°C", boil: "3825°C", en: 2.28 }),
        E(79, "Au", "Oltin", "196.97", "transition", "Qattiq", "Qadimdan ma'lum", "Qimmatbaho, kimyoviy inert va yumshoq metall.", "Zargarlik, elektronika va valyuta zaxiralarida.", { density: "19.32 g/cm³", melt: "1064.18°C", boil: "2970°C", en: 2.54 }),
        E(80, "Hg", "Simob", "200.59", "transition", "Suyuq", "Qadimdan ma'lum", "Xona haroratida suyuq bo'lgan yagona metall.", "Termometrlar, barometrlar va lampalarda.", { density: "13.534 g/cm³", melt: "-38.83°C", boil: "356.73°C", en: 2.00 }),
        E(81, "Tl", "Talliy", "204.38", "post-transition", "Qattiq", "1861", "Zaharli, yumshoq og'ir metall.", "Infraqizil detektorlar, elektronika va tibbiyotda.", { density: "11.85 g/cm³", melt: "304°C", boil: "1473°C", en: 1.62 }),
        E(82, "Pb", "Qo'rg'oshin", "207.2", "post-transition", "Qattiq", "Qadimdan ma'lum", "Og'ir, zaharli va yumshoq metall.", "Akkumulyatorlar, himoya ekranlari va qotishmalarda.", { density: "11.34 g/cm³", melt: "327.46°C", boil: "1749°C", en: 2.33 }),
        E(83, "Bi", "Vismut", "208.98", "post-transition", "Qattiq", "1753", "Og'ir, past zaharli metall; kristallari chiroyli.", "Dori-darmonlar, qotishmalar va kosmetikada.", { density: "9.78 g/cm³", melt: "271.4°C", boil: "1564°C", en: 2.02 }),
        E(84, "Po", "Poloniy", "209", "post-transition", "Qattiq", "1898", "Juda radioaktiv metalloid; tabiatda juda kam.", "Statik zaryadsizlantirgichlar va tadqiqotlarda.", { density: "9.196 g/cm³", melt: "254°C", boil: "962°C", en: 2.0, synthetic: false }),
        E(85, "At", "Astat", "210", "halogen", "Qattiq", "1940", "Eng kam uchraydigan tabiiy galogen; radioaktiv.", "Faqat ilmiy tadqiqotlarda.", { density: "7.0 g/cm³", melt: "302°C", boil: "337°C", en: 2.2, synthetic: true }),
        E(86, "Rn", "Radon", "222", "noble", "Gaz", "1900", "Radioaktiv nobial gaz; uran parchalanishidan hosil bo'ladi.", "Tibbiy tadqiqotlar va geologiyada.", { density: "0.00973 g/cm³", melt: "-71°C", boil: "-61.7°C", en: 2.2 }),
        E(87, "Fr", "Fransiy", "223", "alkali", "Qattiq", "1939", "Eng faol ishqoriy metall; juda kam uchraydi.", "Faqat ilmiy tadqiqotlarda.", { density: "1.87 g/cm³", melt: "27°C", boil: "677°C", en: 0.7, synthetic: true }),
        E(88, "Ra", "Radiy", "226", "alkaline-earth", "Qattiq", "1898", "Radioaktiv ishqoriy-yer metalli; nur chiqaradi.", "Ilmiy tadqiqotlar va o'tmishda tibbiyotda.", { density: "5.5 g/cm³", melt: "700°C", boil: "1737°C", en: 0.9 }),
        E(89, "Ac", "Aktiniy", "227", "actinide", "Qattiq", "1899", "Aktinidlar guruhining birinchi elementi; radioaktiv.", "Ilmiy tadqiqotlar va yadro texnologiyalarida.", { density: "10.07 g/cm³", melt: "1050°C", boil: "3200°C", en: 1.1 }),
        E(90, "Th", "Toriy", "232.04", "actinide", "Qattiq", "1829", "Radioaktiv aktinid; yadro yoqilg'isi sifatida qo'llaniladi.", "Yadro energetikasi va tadqiqotlarda.", { density: "11.72 g/cm³", melt: "1750°C", boil: "4788°C", en: 1.3 }),
        E(91, "Pa", "Protaktiniy", "231.04", "actinide", "Qattiq", "1913", "Radioaktiv, juda kam uchraydigan aktinid.", "Ilmiy tadqiqotlarda.", { density: "15.37 g/cm³", melt: "1572°C", boil: "4000°C", en: 1.5 }),
        E(92, "U", "Uran", "238.03", "actinide", "Qattiq", "1789", "Tabiatda uchraydigan eng og'ir element; radioaktiv.", "Yadro yoqilg'isi va qurol ishlab chiqarishda.", { density: "18.95 g/cm³", melt: "1132.2°C", boil: "4131°C", en: 1.38 }),
        E(93, "Np", "Neptuniy", "237", "actinide", "Qattiq", "1940", "Sun'iy radioaktiv aktinid.", "Tadqiqotlar va plutoniy ishlab chiqarishda.", { density: "20.45 g/cm³", melt: "644°C", boil: "3902°C", en: 1.36, synthetic: true }),
        E(94, "Pu", "Plutoniy", "244", "actinide", "Qattiq", "1940", "Sun'iy radioaktiv metall; yadro yoqilg'isi.", "Yadro reaktorlari va kosmik apparatlarda.", { density: "19.84 g/cm³", melt: "639.4°C", boil: "3228°C", en: 1.28, synthetic: true }),
        E(95, "Am", "Ameriky", "243", "actinide", "Qattiq", "1944", "Sun'iy radioaktiv aktinid.", "Tutun detektorlari va tadqiqotlarda.", { density: "13.69 g/cm³", melt: "1176°C", boil: "2607°C", en: 1.13, synthetic: true }),
        E(96, "Cm", "Kyuriy", "247", "actinide", "Qattiq", "1944", "Sun'iy radioaktiv element; kuchli nurlanadi.", "Kosmik apparatlar va tadqiqotlarda.", { density: "13.51 g/cm³", melt: "1345°C", boil: "3110°C", en: 1.28, synthetic: true }),
        E(97, "Bk", "Berkeliy", "247", "actinide", "Qattiq", "1949", "Sun'iy radioaktiv aktinid.", "Ilmiy tadqiqotlarda.", { density: "14.79 g/cm³", melt: "986°C", boil: "2627°C", en: 1.3, synthetic: true }),
        E(98, "Cf", "Kaliforniy", "251", "actinide", "Qattiq", "1950", "Kuchli neytron manbai bo'lgan sun'iy element.", "Tibbiyot, sanoat va tadqiqotlarda.", { density: "15.1 g/cm³", melt: "900°C", boil: "1470°C", en: 1.3, synthetic: true }),
        E(99, "Es", "Eynshteyniy", "252", "actinide", "Qattiq", "1952", "Sun'iy radioaktiv aktinid.", "Faqat ilmiy tadqiqotlarda.", { density: "8.84 g/cm³", melt: "860°C", boil: "996°C", en: 1.3, synthetic: true }),
        E(100, "Fm", "Fermiy", "257", "actinide", "Qattiq", "1952", "Sun'iy radioaktiv element; juda qisqa umr ko'radi.", "Faqat ilmiy tadqiqotlarda.", { density: "9.7 g/cm³", melt: "1527°C", en: 1.3, synthetic: true }),
        E(101, "Md", "Mendeleviy", "258", "actinide", "Qattiq", "1955", "Sun'iy radioaktiv aktinid.", "Faqat ilmiy tadqiqotlarda.", { density: "10.3 g/cm³", melt: "827°C", en: 1.3, synthetic: true }),
        E(102, "No", "Nobeliy", "259", "actinide", "Qattiq", "1966", "Sun'iy radioaktiv aktinid.", "Faqat ilmiy tadqiqotlarda.", { density: "9.9 g/cm³", melt: "827°C", en: 1.3, synthetic: true }),
        E(103, "Lr", "Lourensiy", "266", "actinide", "Qattiq", "1961", "Aktinidlar guruhining oxirgi elementi.", "Faqat ilmiy tadqiqotlarda.", { density: "15.6 g/cm³", melt: "1627°C", en: 1.3, synthetic: true }),
        E(104, "Rf", "Rezerfordiy", "267", "transition", "Qattiq", "1964", "Sun'iy superog'ir element; transaktinid.", "Faqat ilmiy tadqiqotlarda.", { density: "23.2 g/cm³", melt: "2100°C", boil: "5500°C", synthetic: true }),
        E(105, "Db", "Dubniy", "268", "transition", "Qattiq", "1967", "Sun'iy superog'ir element.", "Faqat ilmiy tadqiqotlarda.", { density: "29.3 g/cm³", synthetic: true }),
        E(106, "Sg", "Seaborgiy", "269", "transition", "Qattiq", "1974", "Sun'iy superog'ir element; Glenn Seaborg sharafiga.", "Faqat ilmiy tadqiqotlarda.", { density: "35.0 g/cm³", synthetic: true }),
        E(107, "Bh", "Boriy", "270", "transition", "Qattiq", "1981", "Sun'iy superog'ir element; Niels Bohr sharafiga.", "Faqat ilmiy tadqiqotlarda.", { density: "37.1 g/cm³", synthetic: true }),
        E(108, "Hs", "Hasiy", "269", "transition", "Qattiq", "1984", "Sun'iy superog'ir element; Hesse sharafiga.", "Faqat ilmiy tadqiqotlarda.", { density: "40.7 g/cm³", synthetic: true }),
        E(109, "Mt", "Meitneriy", "278", "transition", "Qattiq", "1982", "Sun'iy superog'ir element; Lise Meitner sharafiga.", "Faqat ilmiy tadqiqotlarda.", { density: "37.4 g/cm³", synthetic: true }),
        E(110, "Ds", "Darmstadtium", "281", "transition", "Qattiq", "1994", "Sun'iy superog'ir element; Darmstadt sharafiga.", "Faqat ilmiy tadqiqotlarda.", { density: "34.8 g/cm³", synthetic: true }),
        E(111, "Rg", "Rentgeniy", "282", "transition", "Qattiq", "1994", "Sun'iy superog'ir element; Rentgen sharafiga.", "Faqat ilmiy tadqiqotlarda.", { density: "28.7 g/cm³", synthetic: true }),
        E(112, "Cn", "Kopernikiy", "285", "transition", "Qattiq", "1996", "Sun'iy superog'ir element; Kopernik sharafiga.", "Faqat ilmiy tadqiqotlarda.", { density: "23.7 g/cm³", melt: "283°C", boil: "340°C", synthetic: true }),
        E(113, "Nh", "Nihoniy", "286", "post-transition", "Qattiq", "2004", "Sun'iy superog'ir element; Yaponiya sharafiga.", "Faqat ilmiy tadqiqotlarda.", { density: "16 g/cm³", melt: "430°C", boil: "1430°C", synthetic: true }),
        E(114, "Fl", "Fleroviy", "289", "post-transition", "Qattiq", "1999", "Sun'iy superog'ir element; Flerov sharafiga.", "Faqat ilmiy tadqiqotlarda.", { density: "14 g/cm³", melt: "200°C", boil: "380°C", synthetic: true }),
        E(115, "Mc", "Moskoviy", "290", "post-transition", "Qattiq", "2003", "Sun'iy superog'ir element; Moskva sharafiga.", "Faqat ilmiy tadqiqotlarda.", { density: "13.5 g/cm³", melt: "400°C", boil: "1100°C", synthetic: true }),
        E(116, "Lv", "Livermoriy", "293", "post-transition", "Qattiq", "2000", "Sun'iy superog'ir element; Livermor sharafiga.", "Faqat ilmiy tadqiqotlarda.", { density: "12.9 g/cm³", melt: "637°C", boil: "1085°C", synthetic: true }),
        E(117, "Ts", "Tennessin", "294", "halogen", "Qattiq", "2010", "Sun'iy superog'ir galogen.", "Faqat ilmiy tadqiqotlarda.", { density: "7.2 g/cm³", melt: "477°C", boil: "610°C", synthetic: true }),
        E(118, "Og", "Oganesson", "294", "noble", "Gaz", "2002", "Eng og'ir sun'iy element; oganesson nomi bilan ataladi.", "Faqat ilmiy tadqiqotlarda.", { density: "5.0 g/cm³", melt: "325°C", boil: "450°C", synthetic: true })
    ];

    const CATEGORY_INFO = {
        alkali: { label: "Ishqoriy metallar", short: "Ishqoriy", color: "#f59e0b" },
        "alkaline-earth": { label: "Ishqoriy-yer metallari", short: "Ishqoriy-yer", color: "#fb923c" },
        transition: { label: "O'tish metallari", short: "O'tish", color: "#22c55e" },
        "post-transition": { label: "Post-o'tish metallari", short: "Post-o'tish", color: "#14b8a6" },
        metalloid: { label: "Metalloidlar", short: "Metalloid", color: "#a855f7" },
        nonmetal: { label: "Metallmaslar", short: "Metallmas", color: "#ef4444" },
        halogen: { label: "Galogenlar", short: "Galogen", color: "#f97316" },
        noble: { label: "Nobial gazlar", short: "Nobial", color: "#0ea5e9" },
        lanthanide: { label: "Lantanidlar", short: "Lantanid", color: "#8b5cf6" },
        actinide: { label: "Aktinidlar", short: "Aktinid", color: "#ec4899" }
    };

    function positionOf(n) {
        if (n === 1) return { row: 1, col: 1 };
        if (n === 2) return { row: 1, col: 18 };
        if (n >= 3 && n <= 4) return { row: 2, col: n - 2 };
        if (n >= 5 && n <= 10) return { row: 2, col: n + 8 };
        if (n >= 11 && n <= 12) return { row: 3, col: n - 10 };
        if (n >= 13 && n <= 18) return { row: 3, col: n };
        if (n >= 19 && n <= 36) return { row: 4, col: n - 18 };
        if (n >= 37 && n <= 54) return { row: 5, col: n - 36 };
        if (n === 55) return { row: 6, col: 1 };
        if (n === 56) return { row: 6, col: 2 };
        if (n >= 57 && n <= 71) return { row: 9, col: n - 54 };
        if (n >= 72 && n <= 86) return { row: 6, col: n - 68 };
        if (n === 87) return { row: 7, col: 1 };
        if (n === 88) return { row: 7, col: 2 };
        if (n >= 89 && n <= 103) return { row: 10, col: n - 86 };
        if (n >= 104 && n <= 118) return { row: 7, col: n - 100 };
        return null;
    }

    function blockOf(n, group) {
        if (n >= 57 && n <= 71) return "f";
        if (n >= 89 && n <= 103) return "f";
        if (n === 2) return "s";
        if (group <= 2) return "s";
        if (group >= 13) return "p";
        return "d";
    }

    const byNumber = new Map();
    const bySymbol = new Map();
    ELEMENTS.forEach(element => {
        const pos = positionOf(element.n);
        const group = pos ? (pos.row === 9 || pos.row === 10 ? 3 : pos.col) : null;
        element.position = pos;
        element.group = group;
        element.period = pos ? (pos.row === 9 ? 6 : pos.row === 10 ? 7 : pos.row) : null;
        element.block = blockOf(element.n, group);
        element.categoryInfo = CATEGORY_INFO[element.cat] || { label: element.cat, short: element.cat, color: "#64748b" };
        byNumber.set(element.n, element);
        bySymbol.set(element.s.toLowerCase(), element);
    });

    const API = {
        elements: ELEMENTS,
        categories: CATEGORY_INFO,
        positionOf,
        byNumber,
        bySymbol,
        get: n => byNumber.get(Number(n)) || bySymbol.get(String(n).toLowerCase())
    };

    if (typeof module !== "undefined" && module.exports) module.exports = API;
    global.Lab = global.Lab || {};
    global.Lab.elementData = API;
})(typeof window !== "undefined" ? window : globalThis);
