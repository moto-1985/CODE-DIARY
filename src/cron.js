const copySheetWithDate = () => {
    // バインドされたスプレッドシートを取得
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
    // コピー元のシート名を指定
    const sourceSheetName = ORIGIN_SHEET;
  
    // コピー元のシートを取得
    const sourceSheet = spreadsheet.getSheetByName(sourceSheetName);
  
    // 昨日の日付を取得
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = Utilities.formatDate(yesterday, 'Asia/Tokyo', 'yyyyMMdd');
  
    // 新しいシート名を作成
    const newSheetName = formattedDate;
  
    // シートをコピー
    const copiedSheet = sourceSheet.copyTo(spreadsheet);
  
    // コピーしたシートの名前を変更
    copiedSheet.setName(newSheetName);
  
    // コピーしたシートに2行目以降のデータがない場合は赤、ある場合は緑にタブの色を変更
    if (copiedSheet.getLastRow() <= 1) {
      copiedSheet.setTabColor("red");
    } else {
      const range = copiedSheet.getRange(2, 1, copiedSheet.getLastRow() - 1, copiedSheet.getLastColumn());
      const values = range.getValues();
      const isEmpty = values.every(row => row.every(cell => cell === ""));
      copiedSheet.setTabColor(isEmpty ? "red" : "green");
    }
    // 元のシートの2行目以降を削除
    if (sourceSheet.getLastRow() > 1) {
      sourceSheet.deleteRows(2, sourceSheet.getLastRow() - 1);
    }
  }
  
  const copySpreadsheetWithPreviousMonth = () => {
    // 現在のスプレッドシートを取得
    const currentSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
    // 現在の日付を取得
    const currentDate = new Date();
  
    // 前の月の年月を取得
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const previousMonthFormatted = Utilities.formatDate(previousMonth, 'Asia/Tokyo', 'yyyyMM');
  
    // 新しいスプレッドシートの名前を作成
    const newSpreadsheetName = previousMonthFormatted;
  
    // コピー先のフォルダのIDを指定
    const destinationFolderId = OMOIDE_FOLDER;
  
    // コピー先のフォルダを取得
    const destinationFolder = DriveApp.getFolderById(destinationFolderId);
  
    // 現在のスプレッドシートを指定のフォルダにコピー
    const copiedSpreadsheet = currentSpreadsheet.copy(newSpreadsheetName);
    const copiedSpreadsheetFile = DriveApp.getFileById(copiedSpreadsheet.getId());
    destinationFolder.addFile(copiedSpreadsheetFile);
    
    // 元のファイルから"TODAY"シートを除く全てのシートを削除
    const sheets = currentSpreadsheet.getSheets();
    for (let i = 0; i < sheets.length; i++) {
      if (sheets[i].getName() !== ORIGIN_SHEET) {
        currentSpreadsheet.deleteSheet(sheets[i]);
      }
    }
  }