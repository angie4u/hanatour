// 개발 시 필요한 패키지들을 포함시키는 부분
var restify = require('restify')
var builder = require('botbuilder')

// Restify Server 셋팅과정
var server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url)
})

// Bot Framework 서비스랑 커뮤니케이션하기 위해 Chat connector 생성하는 과정
var connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
})

// 사용자 메세지 기다리는 부분
server.post('/api/messages', connector.listen())

var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL)
var inMemoryStorage = new builder.MemoryBotStorage()
// var bot = new builder.UniversalBot(connector)
// This is a dinner reservation bot that uses multiple dialogs to prompt users for input.
var bot = new builder.UniversalBot(connector, [
  function (session) {
    session.send('안녕하세요 하나투어 챗봇입니다!')
    session.beginDialog('askForDestination')
  },
  function (session, results) {
    session.dialogData.country = results.response
    session.beginDialog('askForDate')
  },
  function (session, results) {
    session.dialogData.date = results.response
    session.beginDialog('askForPartySize')
  },
  function (session, results) {
    session.dialogData.partySize = results.response

    session.send(`Reservation confirmed. Reservation details: <br/>Date/Time: ${session.dialogData.reservationDate} <br/>Party size: ${session.dialogData.partySize} <br/>Reservation name: ${session.dialogData.reservationName}`)
    session.endDialog()
  }
]).set('storage', inMemoryStorage) // Register in-memory storage

// bot.recognizer(recognizer)
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
.matches('HotelBooking_HotelName', (session) => {
  session.send('You reached HotelBooking_HotelName intent, you said \'%s\'.', session.message.text)
})
.matches('ConnectAgent', (session) => {
  session.send('You reached Help intent, you said \'%s\'.', session.message.text)
})
.matches('Inquery_Cancel', (session) => {
  session.send('You reached Cancel intent, you said \'%s\'.', session.message.text)
})
.onDefault((session) => {
  session.send('Sorry, I did not understand \'%s\'.', session.message.text)
})

// Dialog to ask for a date and time
bot.dialog('askForDestination', [
  function (session) {
    session.send('호텔 검색을 시작합니다')
    builder.Prompts.choice(session, '숙박하실 지역을 선택주세요', '일본|중국|동남아|미주|유럽', { listStyle: 3 })
  },
  function (session, results) {
    session.endDialogWithResult(results)
  }
])

// Dialog to ask for number of people in the party
bot.dialog('askForDate', [
  function (session) {
    // session.send('호텔 검색을 시작합니다')
    builder.Prompts.choice(session, '아래 버튼을 선택해서 나오는 달력에서 날짜를 선택 해주세요.', '날짜 선택|일정 미정', { listStyle: 3 })
  },
  function (session, results) {
    session.endDialogWithResult(results)
  }
])

// Dialog to ask for the reservation name.
bot.dialog('askForReserverName', [
  function (session) {
    builder.Prompts.text(session, "Who's name will this reservation be under?")
  },
  function (session, results) {
    session.endDialogWithResult(results)
  }
])

bot.dialog('help', function (session, args, next) {
  session.endDialog('이전 작업을 종료하고 처음으로 돌아갑니다.')
})
.triggerAction({
  matches: /^그만$/i

  //test

})
