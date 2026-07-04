# CVR Hesaplayıcı - İçerik Geçerliliği Oranı Hesaplayıcısı

Ölçüm araçlarının içerik geçerliliğini değerlendirmek için modern, Excel benzeri web uygulaması. Araştırmacılar, eğitimciler ve profesyoneller için tasarlanmıştır.

## 🌟 Özellikler

- **Excel Benzeri Arayüz**: Klavye ile gezinme (ok tuşları, Enter), puan yazınca otomatik ilerleme, hücreye doğrudan blok yapıştırma
- **İkili Değerlendirme Modeli**: 
  - **Katı Model**: Sadece "1" değerleri geçerli kabul edilir
  - **Esnek Model**: "1" ve "2" değerleri geçerli kabul edilir
- **Otomatik Hesaplamalar**: Gerçek zamanlı CVR, I-CVI, CVI, S-CVI/Ave ve S-CVI/UA hesaplamaları
- **Excel Entegrasyonu**: Önizlemeli içe aktarma penceresi, sonuçlarla birlikte sekmeli (TSV) panoya kopyalama
- **Görsel Geri Bildirim**: Geçerlilik eşiklerine göre renk kodlu sonuçlar; seçili modele göre renklenen puanlar ve lejant
- **Otomatik Kayıt**: Veriler tarayıcıda saklanır, sayfa kapansa da kaybolmaz; Temizle işlemi geri alınabilir
- **Anlık Rehberlik**: Lawshe eşiği notu, örnek veri yükleme, boş tablo için yönlendirme ekranı
- **Duyarlı Tasarım**: Masaüstü ve mobil cihazlarda çalışır
- **Kapsamlı Dokümantasyon**: Tüm formüllerin yerleşik açıklamaları ve kaynakçaları

## 📊 Hesaplanan İndeksler

### İçerik Geçerliliği Oranı (CVR)
- **Formül**: CVR = (ne - N/2) / (N/2)
- **Amaç**: Madde düzeyinde içerik geçerliliğini ölçer
- **Eşik**: Lawshe'nin minimum CVR değerlerine dayanır

### Madde Düzeyinde İçerik Geçerliliği İndeksi (I-CVI)
- **Formül**: I-CVI = Maddeyi geçerli olarak değerlendiren uzman sayısı / Toplam uzman sayısı
- **Amaç**: Madde geçerliliği için basit anlaşma oranı
- **Eşik**: 
  - 1-2 uzman: I-CVI = 1.0 (yeşil)
  - 3+ uzman: I-CVI ≥ 0.78 (yeşil), 0.70-0.78 (turuncu), <0.70 (kırmızı)

### İçerik Geçerliliği İndeksi (CVI)
- **Formül**: CVI = Tüm CVR değerlerinin ortalaması
- **Amaç**: Genel içerik geçerliliği değerlendirmesi
- **Eşik**: CVI ≥ 0.8 (yeşil), <0.8 (kırmızı)

### Ölçek Düzeyinde CVI/Ortalama (S-CVI/Ave)
- **Formül**: S-CVI/Ave = Tüm I-CVI değerlerinin ortalaması
- **Amaç**: Ölçek düzeyinde içerik geçerliliği
- **Eşik**: S-CVI/Ave ≥ 0.90 (yeşil), <0.90 (kırmızı)

### Ölçek Düzeyinde CVI/Evrensel Anlaşma (S-CVI/UA)
- **Formül**: S-CVI/UA = Evrensel anlaşma olan maddeler / Toplam madde
- **Amaç**: Evrensel anlaşma olan maddelerin oranı
- **Eşik**: S-CVI/UA ≥ 0.80 (yeşil), <0.80 (kırmızı)

## 🚀 Hızlı Başlangıç

1. **Repository'yi klonlayın**:
   ```bash
   git clone https://github.com/username/cvr-calculator.git
   cd cvr-calculator
   ```

2. **Tarayıcıda açın**:
   - Sadece `index.html` dosyasını web tarayıcınızda açın
   - Sunucu kurulumu gerekmez!

3. **Hesaplamaya başlayın**:
   - Sayaçları kullanarak uzman ve madde ekleyin
   - Hücrelere puanları girin (1, 2, 3)
   - Değerlendirme modelinizi seçin (Katı/Esnek)
   - Gerçek zamanlı hesaplamaları görün

## 📖 Kullanım Kılavuzu

### Puanlama Ölçeği (Lawshe)
- **1**: Gerekli
- **2**: Yararlı ama gerekli değil
- **3**: Gerekli değil

### Veri Ekleme
- **Manuel Giriş**: Hücrelere tıklayın ve puanları yazın (1, 2, 3)
- **Excel İçe Aktarma**: Canlı önizlemeli "Excel'den Yapıştır" penceresini kullanın veya kopyaladığınız bloğu doğrudan bir hücreye yapıştırın
- **Excel Dışa Aktarma**: "Excel'e Kopyala" ile tabloyu sonuçlarıyla birlikte (sekmeyle ayrılmış) panoya aktarın

### Değerlendirme Modelleri
- **Katı Model**: Sadece "1" değeri gerekli sayılır (2, 3 = gerekli değil)
- **Esnek Model**: "1" ve "2" değerleri gerekli sayılır (3 = gerekli değil)

### Sonuçları Anlama
- **Yeşil**: Değerler geçerlilik kriterlerini karşılar
- **Turuncu**: Değerler revizyon gerektirir
- **Kırmızı**: Değerler geçersiz veya elimine edilmelidir
- **Turuncu Hücreler**: Kısmen doldurulmuş satırda eksik kalan puanlar

## 🛠️ Teknik Detaylar

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Bağımlılıklar**: Yok (saf vanilla JavaScript)
- **Tarayıcı Desteği**: Modern tarayıcılar (Chrome, Firefox, Safari, Edge)
- **Duyarlı**: Mobil uyumlu tasarım
- **Performans**: İstemci tarafı hesaplamalar, sunucu gerekmez

## 📚 Kaynaklar

- Lawshe, C. H. (1975). A quantitative approach to content validity. Personnel Psychology, 28(4), 563-575.
- Lynn, M. R. (1986). Determination and quantification of content validity. Nursing Research, 35(6), 382-385.
- Polit, D. F., & Beck, C. T. (2006). The content validity index: are you sure you know what's being reported? Research in Nursing & Health, 29(5), 489-497.
- Waltz, C. F., Strickland, O. L., & Lenz, E. R. (2005). Measurement in nursing and health research. Springer Publishing Company.
- Shi, J., Mo, X., & Sun, Z. (2012). Content validity index in scale development. Zhong Nan Da Xue Xue Bao Yi Xue Ban, 37(2), 152-155.

## 🤝 Katkıda Bulunma

Katkılarınız memnuniyetle karşılanır! Lütfen Pull Request göndermekten çekinmeyin.

## 📄 Lisans

Bu proje açık kaynaklıdır ve [MIT Lisansı](LICENSE) altında mevcuttur.

## 📞 Destek

Herhangi bir sorunla karşılaşırsanız veya sorularınız varsa, lütfen GitHub'da bir issue açın.

---

**Araştırma topluluğu için ❤️ ile yapılmıştır**
