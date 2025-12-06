import { World, Word } from './types';

export const AVATARS = ["🤴", "👸", "🥷", "🧙‍♂️", "🧚‍♀️", "🦸‍♂️", "🦹‍♀️", "🤖", "🦊", "🦁"];
export const TOTAL_LEVELS = 50;

export const WORLDS: World[] = [
  { 
    id: 1, 
    name: "Kampung Permulaan", 
    enemy: "Si Bulat", 
    hp: 40, 
    img: "🌱", 
    theme: "bg-green-600", 
    bgPattern: "bg-green-500", 
    desc: "Langkah pertama anda.",
    textColor: "text-green-100"
  },
  { 
    id: 2, 
    name: "Hutan Belantara", 
    enemy: "Harimau Kumbang", 
    hp: 80, 
    img: "🐅", 
    theme: "bg-emerald-800", 
    bgPattern: "bg-emerald-700", 
    desc: "Awas binatang buas!",
    textColor: "text-emerald-100"
  },
  { 
    id: 3, 
    name: "Kota Raya", 
    enemy: "Robot Besi", 
    hp: 120, 
    img: "🏙️", 
    theme: "bg-blue-700", 
    bgPattern: "bg-blue-600", 
    desc: "Dunia moden yang sibuk.",
    textColor: "text-blue-100"
  },
  { 
    id: 4, 
    name: "Gunung Berapi", 
    enemy: "Raksasa Api", 
    hp: 160, 
    img: "🌋", 
    theme: "bg-red-800", 
    bgPattern: "bg-red-700", 
    desc: "Panas dan berbahaya!",
    textColor: "text-red-100"
  },
  { 
    id: 5, 
    name: "Istana Angkasa", 
    enemy: "Raja Langit", 
    hp: 200, 
    img: "🏰", 
    theme: "bg-purple-800", 
    bgPattern: "bg-purple-700", 
    desc: "Cabaran terakhir.",
    textColor: "text-purple-100"
  }
];

const generateWordList = (): Word[] => {
    const rawData = [
        "saya|我", "kami|我们 (排除听者)", "kita|我们 (包括听者)", "awak|你", "kamu|你们", "dia|他/她", "mereka|他们", "kawan|朋友", "cikgu|老师", "murid|学生",
        "lelaki|男人/男孩", "perempuan|女人/女孩", "budak|小孩", "abang|哥哥", "kakak|姐姐", "adik|弟弟/妹妹", "ayah|爸爸", "ibu|妈妈", "datuk|爷爷/外公", "nenek|奶奶/外婆",
        "kepala|头", "rambut|头发", "mata|眼睛", "telinga|耳朵", "hidung|鼻子", "mulut|嘴巴", "gigi|牙齿", "tangan|手", "kaki|脚", "jari|手指",
        "badan|身体", "perut|肚子", "bahu|肩膀", "lutut|膝盖", "muka|脸", "buku|书", "meja|桌子", "kerusi|椅子", "papan hitam|黑板", "pensel|铅笔",
        "pemadam|橡皮擦", "pembaris|尺", "beg|包", "kertas|纸", "gunting|剪刀", "gam|胶水", "warna|颜色", "pembaris|尺", "pemotong|刀片", "jadual|时间表",
        "kelas|班级", "bilik darjah|教室", "loceng|铃", "sekolah|学校", "kantin|食堂", "rumah|家", "bilik|房间", "dapur|厨房", "bilik mandi|浴室", "tandas|厕所",
        "pintu|门", "tingkap|窗户", "lampu|灯", "kipas|风扇", "meja makan|餐桌", "kerusi|椅子", "almari|橱柜", "katil|床", "bantal|枕头", "selimut|被子",
        "telefon|电话", "peti sejuk|冰箱", "air|水", "api|火", "pinggan|盘子", "kucing|猫", "anjing|狗", "ayam|鸡", "itik|鸭子", "lembu|牛",
        "kambing|羊", "kuda|马", "burung|鸟", "ikan|鱼", "harimau|老虎", "gajah|大象", "monyet|猴子", "ular|蛇", "semut|蚂蚁", "lipas|蟑螂",
        "rama-rama|蝴蝶", "lebah|蜜蜂", "katak|青蛙", "kerbau|水牛", "zirafah|长颈鹿", "nasi|饭", "roti|面包", "mee|面", "sup|汤", "ayam goreng|炸鸡",
        "telur|鸡蛋", "susu|牛奶", "kopi|咖啡", "teh|茶", "air|水", "jus|果汁", "ikan|鱼", "sayur|蔬菜", "buah|水果", "epal|苹果",
        "oren|橙", "pisang|香蕉", "gula|糖", "garam|盐", "minyak|油", "hujan|雨", "panas|热", "sejuk|冷", "angin|风", "salji|雪",
        "awan|云", "pasir|沙", "sungai|河", "laut|海", "gunung|山", "pokok|树", "bunga|花", "rumput|草", "bulan|月亮", "matahari|太阳",
        "makan|吃", "minum|喝", "tidur|睡", "bangun|醒/站起", "pergi|去", "datang|来", "duduk|坐", "berdiri|站", "baca|读", "tulis|写",
        "dengar|听", "lihat|看", "cakap|说", "senyum|笑", "ketawa|大笑", "menangis|哭", "main|玩", "lompat|跳", "jalan|走", "lari|跑",
        "tolong|帮忙", "buat|做", "ambil|拿", "bagi|给", "pegang|握/拿", "buka|开", "tutup|关", "masak|煮", "mandi|洗澡", "belajar|学习",
        "besar|大", "kecil|小", "panjang|长", "pendek|短/矮", "tinggi|高", "rendah|矮/低", "kuat|强", "lemah|弱", "cepat|快", "lambat|慢",
        "bagus|好", "baik|好/善良", "jahat|坏", "cantik|美", "pandai|聪明", "bodoh|笨", "murah|便宜", "mahal|贵", "bersih|干净", "kotor|脏",
        "ya|是", "tidak|不", "jangan|不要/别", "sudah|已经", "belum|还没", "sangat|非常", "lebih|更多", "kurang|更少", "sini|这里", "sana|那里",
        "atas|上", "bawah|下", "kiri|左", "kanan|右", "bila|几时", "siapa|谁", "apa|什么", "di|在", "dan|和", "atau|或",
        "merah|红", "biru|蓝", "kuning|黄", "hijau|绿", "hitam|黑", "putih|白", "kelabu|灰", "oren|橙色", "ungu|紫", "coklat|褐",
        "kereta|汽车", "bas|巴士", "teksi|德士", "motosikal|摩托车", "lori|罗里", "kapal|船", "bot|小船", "kereta api|火车", "kapal terbang|飞机", "basikal|自行车",
        "van|货车", "feri|渡轮", "beca|三轮车", "ambulans|救护车", "trak|卡车", "skuter|滑板车", "helikopter|直升机", "kapal selam|潜水艇", "jambatan|桥", "jalan raya|马路",
        "sapu|扫", "basuh|洗", "masak|煮", "gosok|擦/磨", "lipat|折", "kemas|整理", "potong|切/剪", "isi|装/填", "buang|丢", "cuci|洗",
        "jemur|晒", "sidai|晾", "kering|干", "simpan|收", "susun|排", "mop|拖", "tukar|换", "periksa|检查", "cabut|拔", "tampal|贴",
        "pensel warna|彩色铅笔", "pen|钢笔", "pemadam pensel|铅笔擦", "pemotong kertas|切纸机", "buku latihan|练习簿", "buku teks|课本", "kamus|字典", "pembaris besi|铁尺", "pembaris plastik|塑料尺", "pensil kotak|铅笔盒",
        "fail|文件夹", "pita pelekat|胶带", "stapler|订书机", "klip kertas|回形针", "marker|马克笔", "papan putih|白板", "papan kenyataan|布告栏", "gam kertas|纸胶水", "meja guru|老师桌子", "jadual sekolah|学校时间表",
        "doktor|医生", "jururawat|护士", "polis|警察", "bomba|消防员", "petani|农夫", "nelayan|渔夫", "pemandu|司机", "tukang masak|厨师", "tukang kayu|木匠", "penjual|销售员",
        "pekebun|园丁", "penjaga|看守员", "pekerja|工人", "jurutera|工程师", "cikgu tadika|幼儿园老师", "peniaga|商人", "posmen|邮差", "askar|军人", "akauntan|会计师", "pengurus|经理",
        "pasar|巴刹/市场", "taman|公园", "kedai|商店", "perpustakaan|图书馆", "pejabat|办公室", "hospital|医院", "klinik|诊所", "sekolah rendah|小学", "sekolah menengah|中学", "rumah pangsa|组屋",
        "stesen bas|巴士站", "stesen kereta api|火车站", "lapangan terbang|飞机场", "kolam renang|游泳池", "ladang|农场", "kebun|果园", "padang|草场", "bilik guru|教师办公室", "kantin sekolah|学校食堂", "muzium|博物馆",
        "sabun|肥皂", "syampu|洗发水", "ubat gigi|牙膏", "berus gigi|牙刷", "tuala|毛巾", "bakul|篮子", "baldi|水桶", "penyapu|扫把", "mop lantai|拖把", "pinggan mangkuk|碗碟",
        "sudu|汤匙", "garfu|叉", "pisau|刀", "periuk|锅", "kuali|炒锅", "termos|热水壶", "botol|瓶子", "bekas makanan|饭盒", "tilam|床垫", "cermin|镜子",
        "satu|一", "dua|二", "tiga|三", "empat|四", "lima|五", "enam|六", "tujuh|七", "lapan|八", "sembilan|九", "sepuluh|十",
        "banyak|多", "sedikit|少", "semua|全部", "separuh|一半", "beberapa|一些", "gembira|开心", "sedih|伤心", "marah|生气", "takut|害怕", "letih|累",
        "bosan|无聊", "teruja|兴奋", "malu|害羞", "risau|担心", "benci|讨厌", "sayang|爱/疼爱", "rindu|想念", "hairan|惊讶", "tenang|平静", "cemas|焦虑",
        "geram|愤怒/咬牙切齿", "kasihan|可怜", "bangga|骄傲", "yakin|自信", "keliru|困惑", "hari ini|今天", "semalam|昨天", "esok|明天", "pagi|早上", "tengah hari|中午",
        "petang|下午", "malam|晚上", "minggu|周", "bulan|月", "tahun|年", "sekarang|现在", "nanti|等下/以后", "setiap|每个", "selalu|总是", "kadang-kadang|有时候",
        "duduk|坐", "hantar|送", "jawab|回答", "terima|接受", "cari|找", "jumpa|见", "simpan|收/存", "gerak|动", "tarik|拉", "tolak|推",
        "bayar|付钱", "beli|买", "jual|卖", "pilih|选", "tanya|问", "jawab|答", "lawat|参观/拜访", "hias|装饰", "mandi|洗澡", "rebus|水煮",
        "jam|钟/小时", "beg duit|钱包", "kasut|鞋子", "stoking|袜子", "baju|衣服", "seluar|裤子", "topi|帽子", "tali pinggang|腰带", "payung|雨伞", "sunglass|墨镜",
        "dompet|钱包", "telefon bimbit|手机", "pengecas|充电器", "kipas angin|电风扇", "radio|收音机", "televisyen|电视机", "komputer|电脑", "kerusi plastik|塑料椅", "meja lipat|折叠桌", "kipas siling|吊扇",
        "kerana|因为", "bahawa|那个/that", "kalau|如果", "tetapi|但是", "kemudian|然后", "selepas|之后", "sebelum|之前", "hingga|直到", "tanpa|没有/without", "walaupun|虽然",
        "mungkin|可能", "tentu|当然", "pasti|确定", "hampir|几乎", "terus|继续/直接", "tiba-tiba|突然", "kemudian|后来", "sekali|一次/非常", "awal|早", "akhir|晚/最后",
        "tanah|泥土", "batu|石头", "hujan lebat|大雨", "ribut|暴风雨", "kilat|闪电", "pelangi|彩虹", "bintang|星星", "cahaya|光", "api|火", "asap|烟",
        "abu|灰烬", "hutan|森林", "tasik|湖", "pantai|海滩", "ombak|海浪", "angin kuat|大风", "guruh|雷声", "kemarau|旱灾", "banjir|水灾", "lava|熔岩",
        "mi goreng|炒面", "nasi goreng|炒饭", "ayam bakar|烤鸡", "ikan goreng|炸鱼", "sayur campur|杂菜", "sup ayam|鸡汤", "biskut|饼干", "coklat|巧克力", "gula-gula|糖果", "kek|蛋糕",
        "puding|布丁", "ais krim|冰淇淋", "air panas|热水", "air sejuk|冷水", "air kosong|白开水", "teh ais|冰茶", "kopi O|黑咖啡", "nasi lemak|椰浆饭", "roti canai|印度煎饼", "kari|咖喱",
        "idea|主意", "fakta|事实", "pilihan|选择", "tujuan|目的", "sebab|原因", "cara|方法", "masa|时间", "peluang|机会", "usaha|努力", "keputusan|决定",
        "minat|兴趣", "harapan|希望", "masalah|问题", "jawapan|答案", "bantuan|帮助", "perhatian|注意", "perubahan|改变", "kejayaan|成功", "kegagalan|失败", "pengalaman|经验"
    ];

    const list: Word[] = [];
    rawData.forEach((item, index) => {
        const [word, meaning] = item.split('|');
        const level = Math.floor(index / 10) + 1;
        list.push({
            id: index + 1,
            word,
            meaning,
            level
        });
    });
    return list;
};

export const FULL_WORD_LIST = generateWordList();

export const getWordsForLevel = (level: number) => FULL_WORD_LIST.filter(w => w.level === level);

export const getRandomWords = (count: number, rangeStart = 1, rangeEnd = 50) => {
    const pool = FULL_WORD_LIST.filter(w => w.level >= rangeStart && w.level <= rangeEnd);
    return pool.sort(() => 0.5 - Math.random()).slice(0, count);
};

export const generateOptions = (targetWord: Word) => {
    const otherWords = FULL_WORD_LIST.filter(w => w.id !== targetWord.id);
    const distractors = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...distractors, targetWord].sort(() => 0.5 - Math.random());
};
