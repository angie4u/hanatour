### Azure Bot Service에서 받은 예제가 실행이 안되는 경우
Azure Bot Service를 통해 받은 예제는 바로 실행되지 않고 에러 메세지를 보여줍니다... 그 이유는, Bot에서 상태저장을 위해 Azure Table Storage를 사용하는데, Table Storage에 접근하기 위한 연결문자열을 명시하지 않았기 때문에 에러메세지가 발생합니다. 

**const connString =**을 선언하시고 Azure Bot Service 생성시 함께 만들었던 저장소 (혹은 기존에 있던 저장소)의 연결문자열 값을 복사해서 넣어줍니다. 
**process.env['AzureWebJobsStorage']**부분을 **connString**으로 바꾼 후 다시 실행시키시기 바랍니다. :)
여러분은 저와 같은 삽질을 안하시길 바라며... 