import 'package:commection/html/data.dart';
import 'package:fast_immutable_collections/fast_immutable_collections.dart';

/// ページの見出し
/// ```html
/// <h1></h1>
/// ```
HtmlElement h1(
  IList<HtmlElement> children, {
  required String id,
  required String className,
}) =>
    HtmlElement(
      'h1',
      IMap({'id': id, 'class': className}),
      HtmlChildrenElementList(children),
    );

/// ページの見出し
/// ```html
/// <h1></h1>
/// ```
HtmlElement h1Text(
  String text, {
  required String id,
  required String className,
}) =>
    HtmlElement(
      'h1',
      IMap({'id': id, 'class': className}),
      HtmlChildrenText(text),
    );

/// 見出し
/// ```html
/// <h2></h2>
/// ```
HtmlElement h2(
  IList<HtmlElement> children, {
  required String id,
  required String className,
}) =>
    HtmlElement(
      'h2',
      IMap({'id': id, 'class': className}),
      HtmlChildrenElementList(children),
    );

/// 見出し
/// ```html
/// <h2></h2>
/// ```
HtmlElement h2Text(
  String text, {
  required String id,
  required String className,
}) =>
    HtmlElement(
        'h2', IMap({'id': id, 'class': className}), HtmlChildrenText(text));

/// 見出し
/// ```html
/// <h3></h3>
/// ```
HtmlElement h3(
  IList<HtmlElement> children, {
  required String id,
  required String className,
}) =>
    HtmlElement(
      'h3',
      IMap({'id': id, 'class': className}),
      HtmlChildrenElementList(children),
    );

/// 見出し
/// ```html
/// <h3></h3>
/// ```
HtmlElement h3Text(
  String text, {
  required String id,
  required String className,
}) =>
    HtmlElement(
        'h3', IMap({'id': id, 'class': className}), HtmlChildrenText(text));

/// ```html
/// <div></div>
/// ```
HtmlElement div(
  IList<HtmlElement> children, {
  required String id,
  required String className,
}) =>
    HtmlElement(
      'div',
      IMap({'id': id, 'class': className}),
      HtmlChildrenElementList(children),
    );

/// ```html
/// <div></div>
/// ```
HtmlElement divText(
  String text, {
  required String id,
  required String className,
}) =>
    HtmlElement(
      'div',
      IMap({'id': id, 'class': className}),
      HtmlChildrenText(text),
    );

/// ```html
/// <a href={attributes.url}></a>
/// ```
HtmlElement anchor(
  IList<HtmlElement> children, {
  required String id,
  required String className,
  required Uri href,
}) =>
    HtmlElement(
      'a',
      IMap({
        'id': id,
        'class': className,
        'href': href.toString(),
      }),
      HtmlChildrenElementList(children),
    );

/// ```html
/// <img alt={attributes.alt} src={attributes.src}>
/// ```
HtmlElement image(
        {required String id,
        required String className,

        ///  画像のURL
        required Uri src,

        /// 画像のテキストによる説明
        required String alt}) =>
    HtmlElement(
      'img',
      IMap({
        'id': id,
        'class': className,
        'alt': alt,
        'src': src.toString(),
      }),
      HtmlChildrenNoEndTag(),
    );

/// ```html
/// <svg></svg>
/// ```
HtmlElement svg(
  IList<HtmlElement> children, {
  required String id,
  required String className,
  required ({double x, double y, double width, double height}) viewBox,
}) =>
    HtmlElement(
      'svg',
      IMap({
        'id': id,
        'class': className,
        'viewBox': [
          viewBox.x,
          viewBox.y,
          viewBox.width,
          viewBox.height,
        ].join(' '),
      }),
      HtmlChildrenElementList(children),
    );

/// ```html
/// <path />
/// ```
HtmlElement path({
  required String id,
  required String className,
  required String d,
  required String fill,
}) =>
    HtmlElement(
      'path',
      IMap({
        'id': id,
        'class': className,
        'd': d,
        'fill': fill,
      }),
      HtmlChildrenText(''),
    );

/// SVGの要素のアニメーションを指定する. 繰り返す回数は無限回と指定している
class SvgAnimation {
  SvgAnimation({
    required this.attributeName,
    required this.dur,
    required this.from,
    required this.to,
  });

  final SvgAnimationAttributeName attributeName;

  /// 時間
  final double dur;

  /// 開始時の値
  final String from;

  /// 終了時の値
  final String to;
}

enum SvgAnimationAttributeName {
  cy,
  r,
  stroke,
}

/// ```html
/// <circle><circle>
/// ```
HtmlElement circle({
  required String id,
  required String className,
  required double cx,
  required double cy,
  required String fill,
  required double r,
  required String stroke,
  required IList<SvgAnimation>? animations,
}) =>
    HtmlElement(
      'circle',
      IMap({
        'id': id,
        'class': className,
        'cx': cx.toString(),
        'cy': cy.toString(),
        'fill': fill,
        'r': r.toString(),
        'stroke': stroke,
      }),
      animations == null
          ? HtmlChildrenText('')
          : HtmlChildrenElementList(IList(animations.map(animate))),
    );

/// ```html
/// <animate />
/// ```
HtmlElement animate(SvgAnimation svgAnimation) => HtmlElement(
      'animate',
      IMap({
        'attributeName': svgAnimation.attributeName.name,
        'dur': svgAnimation.dur.toString(),
        'from': svgAnimation.from.toString(),
        'repeatCount': 'indefinite',
        'to': svgAnimation.to.toString(),
      }),
      HtmlChildrenText(''),
    );
