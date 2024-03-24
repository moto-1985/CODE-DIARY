function doPost(e) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ORIGIN_SHEET);
    const data = JSON.parse(e.postData.contents);
  
    // データをスプレッドシートに書き込む
    writeToSheet(sheet, data);
  
    return ContentService.createTextOutput("Data saved successfully.");
  }
  
  // スプレッドシートにデータを書き込むための関数
  const writeToSheet = (sheet, data) => {
    const nextRow = findNextEmptyRowPure(sheet, "A");
  
    // スプレッドシートの特定の行にデータを設定する
    ['question', 'answer', 'summary'].forEach((key, index) => {
      sheet.getRange(nextRow, index + 1).setValue(data[key]);
    });
  }
  
  // 次に空の行を見つけるための純粋関数
  const findNextEmptyRowPure = (sheet, column) => {
    const columnData = sheet.getRange(column + ":" + column).getValues();
    const emptyRowIndex = columnData.findIndex(row => row[0] === "");
    return emptyRowIndex + 1; // スプレッドシートの行は1から始まるため
  }
  
  function doGet(e) {
    // クエリパラメータをチェック
    if (e.parameter.action === 'get') {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheets = ss.getSheets();
      let attempts = 0;
  
      while (attempts < sheets.length) {
        const randomSheetIndex = Math.floor(Math.random() * sheets.length);
        const selectedSheet = sheets[randomSheetIndex];
        const range = selectedSheet.getDataRange();
        const values = range.getValues();
  
        // ヘッダーのみあるか、もしくは完全に空のシートを避ける
        if (values.length > 1) {
          // データからランダムに質問と答えを選択
          const randomRowIndex = Math.floor(Math.random() * (values.length - 1)) + 1; // ヘッダー行を除外
          const selectedRow = values[randomRowIndex];
          const qa = {
            question: selectedRow[0], // A列
            answer: selectedRow[1] // B列
          };
  
          return ContentService.createTextOutput(JSON.stringify(qa))
            .setMimeType(ContentService.MimeType.JSON);
        }
  
        attempts += 1;
      }
  
      // すべてのシートを試してもデータが見つからなかった場合
      return ContentService.createTextOutput("No data available in any sheet.")
        .setMimeType(ContentService.MimeType.TEXT);
    } else {
      // HTMLテンプレートファイルを読み込む
      const template = HtmlService.createTemplateFromFile('page');
  
      // スプレッドシートのシート名を取得
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheets = ss.getSheets();
      const sheetNames = sheets.map(sheet => sheet.getName());
  
      // シート名をテンプレートに渡す
      template.sheetNames = sheetNames;
  
      // HTMLを評価し、出力を返す
      return template.evaluate();
    }
  }
  
  const getSheetData = (sheetName) => {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return []; // シートが見つからない場合は空の配列を返す
    return sheet.getDataRange().getValues();
  }