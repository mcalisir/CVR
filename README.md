# CVR Calculator - Content Validity Ratio Calculator

A modern, Excel-like web application for calculating Content Validity Ratio (CVR) and related validity indices. This tool is designed for researchers, educators, and professionals who need to assess the content validity of measurement instruments.

## 🌟 Features

- **Excel-like Interface**: Familiar spreadsheet experience with contentEditable cells
- **Dual Evaluation Models**: 
  - **Strict Model**: Only "1" values are considered relevant
  - **Lenient Model**: Both "1" and "2" values are considered relevant
- **Automatic Calculations**: Real-time CVR, I-CVI, CVI, S-CVI/Ave, and S-CVI/UA calculations
- **Excel Integration**: Copy/paste data directly from Excel
- **Visual Feedback**: Color-coded results based on validity thresholds
- **Responsive Design**: Works on desktop and mobile devices
- **Comprehensive Documentation**: Built-in accordion explanations of all formulas

## 📊 Calculated Indices

### Content Validity Ratio (CVR)
- **Formula**: CVR = (ne - N/2) / (N/2)
- **Purpose**: Measures item-level content validity
- **Threshold**: Based on Lawshe's minimum CVR values

### Item-level Content Validity Index (I-CVI)
- **Formula**: I-CVI = Number of experts rating item as relevant / Total number of experts
- **Purpose**: Simple agreement ratio for item relevance
- **Threshold**: 
  - 1-2 experts: I-CVI = 1.0 (green)
  - 3+ experts: I-CVI ≥ 0.78 (green), 0.70-0.78 (orange), <0.70 (red)

### Content Validity Index (CVI)
- **Formula**: CVI = Average of all CVR values
- **Purpose**: Overall content validity assessment
- **Threshold**: CVI ≥ 0.8 (green), <0.8 (red)

### Scale-level CVI/Average (S-CVI/Ave)
- **Formula**: S-CVI/Ave = Average of all I-CVI values
- **Purpose**: Scale-level content validity
- **Threshold**: S-CVI/Ave ≥ 0.90 (green), <0.90 (red)

### Scale-level CVI/Universal Agreement (S-CVI/UA)
- **Formula**: S-CVI/UA = Items with universal agreement / Total items
- **Purpose**: Proportion of items with universal agreement
- **Threshold**: S-CVI/UA ≥ 0.80 (green), <0.80 (red)

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/username/cvr-calculator.git
   cd cvr-calculator
   ```

2. **Open in browser**:
   - Simply open `index.html` in your web browser
   - No server setup required!

3. **Start calculating**:
   - Add experts and items using the control buttons
   - Enter data (0, 1, 2, 3) in the cells
   - Choose your evaluation model (Strict/Lenient)
   - View real-time calculations

## 📖 Usage Guide

### Adding Data
- **Manual Entry**: Click on cells and type values (0, 1, 2, 3)
- **Excel Import**: Use "Paste from Excel" button to import data
- **Excel Export**: Use "Copy to Excel" button to export results

### Evaluation Models
- **Strict Model**: Only "1" values count as relevant (0, 2, 3 = not relevant)
- **Lenient Model**: "1" and "2" values count as relevant (0, 3 = not relevant)

### Understanding Results
- **Green**: Values meet validity criteria
- **Orange**: Values need revision
- **Red**: Values are invalid or need elimination
- **Red Cells**: Empty cells that need data

## 🛠️ Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Dependencies**: None (pure vanilla JavaScript)
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Responsive**: Mobile-friendly design
- **Performance**: Client-side calculations, no server required

## 📚 References

- Lawshe, C. H. (1975). A quantitative approach to content validity. Personnel Psychology, 28(4), 563-575.
- Lynn, M. R. (1986). Determination and quantification of content validity. Nursing Research, 35(6), 382-385.
- Polit, D. F., & Beck, C. T. (2006). The content validity index: are you sure you know what's being reported? Research in Nursing & Health, 29(5), 489-497.
- Waltz, C. F., Strickland, O. L., & Lenz, E. R. (2005). Measurement in nursing and health research. Springer Publishing Company.
- Shi, J., Mo, X., & Sun, Z. (2012). Content validity index in scale development. Zhong Nan Da Xue Xue Bao Yi Xue Ban, 37(2), 152-155.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Made with ❤️ for the research community**
