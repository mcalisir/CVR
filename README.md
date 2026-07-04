# CVR Calculator - Content Validity Ratio Calculator

A modern, Excel-like web application for calculating Content Validity Ratio (CVR) and related validity indices. This tool is designed for researchers, educators, and professionals who need to assess the content validity of measurement instruments.

## 🌟 Features

- **Excel-like Interface**: Keyboard navigation (arrow keys, Enter), auto-advance while typing ratings, paste blocks directly into any cell
- **Dual Evaluation Models**: 
  - **Strict Model**: Only "1" values are considered relevant
  - **Lenient Model**: Both "1" and "2" values are considered relevant
- **Automatic Calculations**: Real-time CVR, I-CVI, CVI, S-CVI/Ave, and S-CVI/UA calculations
- **Excel Integration**: Import dialog with live preview, tab-separated (TSV) clipboard export including results
- **Visual Feedback**: Color-coded results based on validity thresholds; ratings and legend colored by the selected model
- **Autosave**: Data persists in the browser across sessions; Clear can be undone
- **Instant Guidance**: Lawshe threshold note, example data loader, and an empty-state screen with clear next steps
- **Responsive Design**: Works on desktop and mobile devices
- **Comprehensive Documentation**: Built-in explanations of all formulas with references

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
   - Add experts and items using the steppers
   - Enter ratings (1, 2, 3) in the cells
   - Choose your evaluation model (Strict/Lenient)
   - View real-time calculations

## 📖 Usage Guide

### Rating Scale (Lawshe)
- **1**: Essential
- **2**: Useful but not essential
- **3**: Not necessary

### Adding Data
- **Manual Entry**: Click on cells and type ratings (1, 2, 3)
- **Excel Import**: Use "Paste from Excel" (with live preview), or paste a copied block directly into any cell
- **Excel Export**: Use "Copy to Excel" to export the table with results (tab-separated)

### Evaluation Models
- **Strict Model**: Only "1" counts as relevant (2, 3 = not relevant)
- **Lenient Model**: "1" and "2" count as relevant (3 = not relevant)

### Understanding Results
- **Green**: Values meet validity criteria
- **Orange**: Values need revision
- **Red**: Values are invalid or need elimination
- **Orange Cells**: Missing ratings in a partially filled row

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
