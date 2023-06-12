import 'package:fast_immutable_collections/fast_immutable_collections.dart';
import 'package:meta/meta.dart';

@immutable
final class StructuredHtml {
  const StructuredHtml({
    required this.pageName,
    required this.appName,
    required this.description,
    required this.themeColor,
    required this.iconUrl,
    required this.ietfLanguageTag,
    required this.coverImageUrl,
    required this.url,
    required this.twitterCard,
    required this.style,
    required this.styleUrlList,
    required this.scriptUrlList,
    required this.bodyClass,
    required this.children,
  });

  /// ページ名
  ///
  /// Google 検索のページ名や, タブ, ブックマークのタイトル, OGPのタイトルなどに使用される
  final String pageName;

  /// アプリ名 / サイト名 (HTML出力のみ反映)
  final String appName;

  /// ページの説明 (HTML出力のみ反映)
  final String description;

  /// テーマカラー
  final Color themeColor;

  /// アイコン画像のURL
  final Uri iconUrl;

  /// 使用している言語
  final String ietfLanguageTag;

  /// OGPに使われるカバー画像のURL (CORSの制限を受けない)
  final Uri coverImageUrl;

  /// ページのURL. できれば指定して欲しいが, ログインコールバックURLの場合など, OGP を使わないなら `undefined` を指定する
  final Uri? url;

  /// Twitter Card。Twitterでシェアしたときの表示をどうするか
  final TwitterCard twitterCard;

  /// 全体に適応されるスタイル. CSS
  final String? style;

  /// スタイルのURL
  final IList<Uri> styleUrlList;

  /// スクリプトのURL
  final IList<Uri> scriptUrlList;

  /// body の class
  final String? bodyClass;

  /// body の 子要素
  final IList<HtmlElement> children;
}

@immutable
final class Color {
  const Color(this.r, this.g, this.b);

  final double r;
  final double g;
  final double b;
}

/// Twitter Card。Twitterでシェアしたときの表示をどうするか
enum TwitterCard {
  summaryCard,
  summaryCardWithLargeImage,
}

/// HtmlElement
final class HtmlElement {
  const HtmlElement(
    this.name,
    this.attributes,
    this.children,
  );

  /// 要素名 `h1` や `div` など
  final String name;
  final IMap<String, String?> attributes;
  final HtmlChildren children;
}

/// HtmlElementの 子要素
@immutable
sealed class HtmlChildren {
  const HtmlChildren();
}

final class HtmlChildrenElementList implements HtmlChildren {
  const HtmlChildrenElementList(this.elementList);
  final IList<HtmlElement> elementList;
}

final class HtmlChildrenText implements HtmlChildren {
  const HtmlChildrenText(this.text);
  final String text;
}

final class HtmlChildrenRawText implements HtmlChildren {
  const HtmlChildrenRawText(this.text);
  final String text;
}

final class HtmlChildrenNoEndTag implements HtmlChildren {
  const HtmlChildrenNoEndTag();
}
