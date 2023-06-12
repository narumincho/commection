import 'dart:io';

Future<void> main() async {
  // If the "PORT" environment variable is set, listen to it. Otherwise, 8080.
  // https://cloud.google.com/run/docs/reference/container-contract#port
  final port = int.parse(Platform.environment['PORT'] ?? '8080');

  final server = await HttpServer.bind(InternetAddress.anyIPv4, port);

  print('Serving at http://${server.address.host}:${server.port}');

  server.listen((request) {
    request.response.headers.contentType = ContentType.html;
    request.response.write('''
<!doctype html>
<html lang="ja">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body {
font-size: 48px;
color: white;
background-color: black;
}
</style>
</head>

<body>
<div>Dart で HTTP サーバーを建ててみた!</div>
<div>現在の時刻 ${DateTime.now().toIso8601String()}</div>
</body>

</html>
''');
    request.response.close();
  });
}
