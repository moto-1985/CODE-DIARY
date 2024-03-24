function testDoPost() {
    const e = {
      postData: {
        contents: JSON.stringify({
          question: "テストの質問",
          answer: "テストの回答",
          summary: "テストの要約"
        })
      }
    };
  
    const result = doPost(e);
    console.log(result);
  }