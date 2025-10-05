# CVR Hesaplayıcı - İçerik Geçerliliği Oranı Hesaplayıcısı

Ölçüm araçlarının içerik geçerliliğini değerlendirmek için modern, Excel benzeri web uygulaması. Araştırmacılar, eğitimciler ve profesyoneller için tasarlanmıştır.

## 🌟 Özellikler

- **Excel Benzeri Arayüz**: Tanıdık elektronik tablo deneyimi, doğrudan düzenlenebilir hücreler
- **İkili Değerlendirme Modeli**: 
  - **Sert Model**: Sadece "1" değerleri geçerli kabul edilir
  - **Rahat Model**: "1" ve "2" değerleri geçerli kabul edilir
- **Otomatik Hesaplamalar**: Gerçek zamanlı CVR, I-CVI, CVI, S-CVI/Ave ve S-CVI/UA hesaplamaları
- **Excel Entegrasyonu**: Excel'den doğrudan veri kopyala/yapıştır
- **Görsel Geri Bildirim**: Geçerlilik eşiklerine göre renk kodlu sonuçlar
- **Duyarlı Tasarım**: Masaüstü ve mobil cihazlarda çalışır
- **Kapsamlı Dokümantasyon**: Tüm formüllerin yerleşik akordeon açıklamaları

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
   - Kontrol butonlarını kullanarak uzman ve madde ekleyin
   - Hücrelere veri girin (0, 1, 2, 3)
   - Değerlendirme modelinizi seçin (Sert/Rahat)
   - Gerçek zamanlı hesaplamaları görün

## 📖 Kullanım Kılavuzu

### Veri Ekleme
- **Manuel Giriş**: Hücrelere tıklayın ve değerleri yazın (0, 1, 2, 3)
- **Excel İçe Aktarma**: "Excel'den Yapıştır" butonunu kullanarak veri içe aktarın
- **Excel Dışa Aktarma**: "Excel'e Kopyala" butonunu kullanarak sonuçları dışa aktarın

### Değerlendirme Modelleri
- **Sert Model**: Sadece "1" değerleri geçerli sayılır (0, 2, 3 = geçersiz)
- **Rahat Model**: "1" ve "2" değerleri geçerli sayılır (0, 3 = geçersiz)

### Sonuçları Anlama
- **Yeşil**: Değerler geçerlilik kriterlerini karşılar
- **Turuncu**: Değerler revizyon gerektirir
- **Kırmızı**: Değerler geçersiz veya elimine edilmelidir
- **Kırmızı Hücreler**: Veri gerektiren boş hücreler

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
