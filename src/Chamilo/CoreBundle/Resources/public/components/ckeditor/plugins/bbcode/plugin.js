﻿/*
 Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
*/
(function () {
    CKEDITOR.on("dialogDefinition", function (a) {
        var b;
        b = a.data.name;
        a = a.data.definition;
        "link" == b ? (a.removeContents("target"), a.removeContents("upload"), a.removeContents("advanced"), b = a.getContents("info"), b.remove("emailSubject"), b.remove("emailBody")) : "image" == b && (a.removeContents("advanced"), b = a.getContents("Link"), b.remove("cmbTarget"), b = a.getContents("info"), b.remove("txtAlt"), b.remove("basic"))
    });
    var j = {
        b: "strong",
        u: "u",
        i: "em",
        color: "span",
        size: "span",
        quote: "blockquote",
        code: "code",
        url: "a",
        email: "span",
        img: "span",
        "*": "li",
        list: "ol"
    }, t = {
        strong: "b",
        b: "b",
        u: "u",
        em: "i",
        i: "i",
        code: "code",
        li: "*"
    }, k = {
        strong: "b",
        em: "i",
        u: "u",
        li: "*",
        ul: "list",
        ol: "list",
        code: "code",
        a: "link",
        img: "img",
        blockquote: "quote"
    }, u = {color: "color", size: "font-size"}, v = {
        url: "href",
        email: "mailhref",
        quote: "cite",
        list: "listType"
    }, l = CKEDITOR.dtd, w = CKEDITOR.tools.extend({table: 1}, l.$block, l.$listItem, l.$tableContent, l.$list), y = /\s*(?:;\s*|$)/, n = {
        smiley: ":)",
        sad: ":(",
        wink: ";)",
        laugh: ":D",
        cheeky: ":P",
        blush: ":*)",
        surprise: ":-o",
        indecision: ":|",
        angry: ">:(",
        angel: "o:)",
        cool: "8-)",
        devil: ">:-)",
        crying: ";(",
        kiss: ":-*"
    }, x = {}, o = [], p;
    for (p in n)x[n[p]] = p, o.push(n[p].replace(/\(|\)|\:|\/|\*|\-|\|/g, function (a) {
        return "\\" + a
    }));
    var o = RegExp(o.join("|"), "g"), z = function () {
        var a = [], b = {nbsp: " ", shy: "­", gt: ">", lt: "<"}, c;
        for (c in b)a.push(c);
        a = RegExp("&(" + a.join("|") + ");", "g");
        return function (c) {
            return c.replace(a, function (f, a) {
                return b[a]
            })
        }
    }();
    CKEDITOR.BBCodeParser = function () {
        this._ = {bbcPartsRegex: /(?:\[([^\/\]=]*?)(?:=([^\]]*?))?\])|(?:\[\/([a-z]{1,16})\])/ig}
    };
    CKEDITOR.BBCodeParser.prototype = {
        parse: function (a) {
            for (var b, c, h = 0; b = this._.bbcPartsRegex.exec(a);) {
                c = b.index;
                if (c > h)this.onText(a.substring(h, c), 1);
                h = this._.bbcPartsRegex.lastIndex;
                if ((c = (b[1] || b[3] || "").toLowerCase()) && !j[c])this.onText(b[0]); else if (b[1]) {
                    var f = j[c], i = {}, g = {};
                    if (b = b[2])if ("list" == c && (isNaN(b) ? /^[a-z]+$/.test(b) ? b = "lower-alpha" : /^[A-Z]+$/.test(b) && (b = "upper-alpha") : b = "decimal"), u[c]) {
                        "size" == c && (b += "%");
                        g[u[c]] = b;
                        b = i;
                        var e = "", d = void 0;
                        for (d in g)var q = (d + ":" + g[d]).replace(y, ";"),
                            e = e + q;
                        b.style = e
                    } else v[c] && (i[v[c]] = b);
                    if ("email" == c || "img" == c)i.bbcode = c;
                    this.onTagOpen(f, i, CKEDITOR.dtd.$empty[f])
                } else if (b[3])this.onTagClose(j[c])
            }
            if (a.length > h)this.onText(a.substring(h, a.length), 1)
        }
    };
    CKEDITOR.htmlParser.fragment.fromBBCode = function (a) {
        function b(a) {
            if (0 < g.length)for (var f = 0; f < g.length; f++) {
                var b = g[f], c = b.name, i = CKEDITOR.dtd[c], e = d.name && CKEDITOR.dtd[d.name];
                if ((!e || e[c]) && (!a || !i || i[a] || !CKEDITOR.dtd[a]))b = b.clone(), b.parent = d, d = b, g.splice(f, 1), f--
            }
        }

        function c(f, a) {
            var b = d.children.length,
                c = 0 < b && d.children[b - 1], b = !c && r.getRule(k[d.name], "breakAfterOpen"), c = c && c.type == CKEDITOR.NODE_ELEMENT && r.getRule(k[c.name], "breakAfterClose"), i = f && r.getRule(k[f], a ? "breakBeforeClose" : "breakBeforeOpen");
            e && (b || c || i) && e--;
            e && f in w && e++;
            for (; e && e--;)d.children.push(new CKEDITOR.htmlParser.element("br"))
        }

        function h(f, a) {
            c(f.name, 1);
            var a = a || d || i, b = a.children.length;
            f.previous = 0 < b && a.children[b - 1] || null;
            f.parent = a;
            a.children.push(f);
            f.returnPoint && (d = f.returnPoint, delete f.returnPoint)
        }

        var f = new CKEDITOR.BBCodeParser,
            i = new CKEDITOR.htmlParser.fragment, g = [], e = 0, d = i, q;
        f.onTagOpen = function (a, i) {
            var e = new CKEDITOR.htmlParser.element(a, i);
            if (CKEDITOR.dtd.$removeEmpty[a])g.push(e); else {
                var s = d.name, m = s && (CKEDITOR.dtd[s] || (d._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span));
                if (m && !m[a]) {
                    var m = !1, j;
                    a == s ? h(d, d.parent) : (a in CKEDITOR.dtd.$listItem ? (f.onTagOpen("ul", {}), j = d) : (h(d, d.parent), g.unshift(d)), m = !0);
                    d = j ? j : d.returnPoint || d.parent;
                    if (m) {
                        f.onTagOpen.apply(this, arguments);
                        return
                    }
                }
                b(a);
                c(a);
                e.parent = d;
                e.returnPoint =
                    q;
                q = 0;
                e.isEmpty ? h(e) : d = e
            }
        };
        f.onTagClose = function (a) {
            for (var f = g.length - 1; 0 <= f; f--)if (a == g[f].name) {
                g.splice(f, 1);
                return
            }
            for (var b = [], c = [], e = d; e.type && e.name != a;)e._.isBlockLike || c.unshift(e), b.push(e), e = e.parent;
            if (e.type) {
                for (f = 0; f < b.length; f++)a = b[f], h(a, a.parent);
                d = e;
                h(e, e.parent);
                e == d && (d = d.parent);
                g = g.concat(c)
            }
        };
        f.onText = function (a) {
            var f = CKEDITOR.dtd[d.name];
            if (!f || f["#"])c(), b(), a.replace(/(\r\n|[\r\n])|[^\r\n]*/g, function (a, f) {
                if (void 0 !== f && f.length)e++; else if (a.length) {
                    var b = 0;
                    a.replace(o,
                        function (f, e) {
                            h(new CKEDITOR.htmlParser.text(a.substring(b, e)), d);
                            h(new CKEDITOR.htmlParser.element("smiley", {desc: x[f]}), d);
                            b = e + f.length
                        });
                    b != a.length && h(new CKEDITOR.htmlParser.text(a.substring(b, a.length)), d)
                }
            })
        };
        for (f.parse(CKEDITOR.tools.htmlEncode(a)); d.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT;)a = d.parent, h(d, a), d = a;
        return i
    };
    var r = new (CKEDITOR.tools.createClass({
        $: function () {
            this._ = {output: [], rules: []};
            this.setRules("list", {
                breakBeforeOpen: 1,
                breakAfterOpen: 1,
                breakBeforeClose: 1,
                breakAfterClose: 1
            });
            this.setRules("*", {
                breakBeforeOpen: 1,
                breakAfterOpen: 0,
                breakBeforeClose: 1,
                breakAfterClose: 0
            });
            this.setRules("quote", {
                breakBeforeOpen: 1,
                breakAfterOpen: 0,
                breakBeforeClose: 0,
                breakAfterClose: 1
            })
        }, proto: {
            setRules: function (a, b) {
                var c = this._.rules[a];
                c ? CKEDITOR.tools.extend(c, b, !0) : this._.rules[a] = b
            }, getRule: function (a, b) {
                return this._.rules[a] && this._.rules[a][b]
            }, openTag: function (a) {
                a in j && (this.getRule(a, "breakBeforeOpen") && this.lineBreak(1), this.write("[", a))
            }, openTagClose: function (a) {
                "br" == a ? this._.output.push("\n") :
                a in j && (this.write("]"), this.getRule(a, "breakAfterOpen") && this.lineBreak(1))
            }, attribute: function (a, b) {
                "option" == a && ("string" == typeof b && (b = b.replace(/&amp;/g, "&")), this.write("=", b))
            }, closeTag: function (a) {
                a in j && (this.getRule(a, "breakBeforeClose") && this.lineBreak(1), "*" != a && this.write("[/", a, "]"), this.getRule(a, "breakAfterClose") && this.lineBreak(1))
            }, text: function (a) {
                this.write(a)
            }, comment: function () {
            }, lineBreak: function () {
                !this._.hasLineBreak && this._.output.length && (this.write("\n"), this._.hasLineBreak =
                    1)
            }, write: function () {
                this._.hasLineBreak = 0;
                this._.output.push(Array.prototype.join.call(arguments, ""))
            }, reset: function () {
                this._.output = [];
                this._.hasLineBreak = 0
            }, getHtml: function (a) {
                var b = this._.output.join("");
                a && this.reset();
                return z(b)
            }
        }
    }));
    CKEDITOR.plugins.add("bbcode", {
        requires: "entities", beforeInit: function (a) {
            CKEDITOR.tools.extend(a.config, {
                enterMode: CKEDITOR.ENTER_BR,
                basicEntities: !1,
                entities: !1,
                fillEmptyBlocks: !1
            }, !0);
            a.filter.disable();
            a.activeEnterMode = a.enterMode = CKEDITOR.ENTER_BR
        }, init: function (a) {
            function b(a) {
                var b =
                    a.data, a = CKEDITOR.htmlParser.fragment.fromBBCode(a.data.dataValue), c = new CKEDITOR.htmlParser.basicWriter;
                a.writeHtml(c, h);
                a = c.getHtml(!0);
                b.dataValue = a
            }

            var c = a.config, h = new CKEDITOR.htmlParser.filter;
            h.addRules({
                elements: {
                    blockquote: function (a) {
                        var b = new CKEDITOR.htmlParser.element("div");
                        b.children = a.children;
                        a.children = [b];
                        if (b = a.attributes.cite) {
                            var c = new CKEDITOR.htmlParser.element("cite");
                            c.add(new CKEDITOR.htmlParser.text(b.replace(/^"|"$/g, "")));
                            delete a.attributes.cite;
                            a.children.unshift(c)
                        }
                    },
                    span: function (a) {
                        var b;
                        if (b = a.attributes.bbcode)"img" == b ? (a.name = "img", a.attributes.src = a.children[0].value, a.children = []) : "email" == b && (a.name = "a", a.attributes.href = "mailto:" + a.children[0].value), delete a.attributes.bbcode
                    }, ol: function (a) {
                        a.attributes.listType ? "decimal" != a.attributes.listType && (a.attributes.style = "list-style-type:" + a.attributes.listType) : a.name = "ul";
                        delete a.attributes.listType
                    }, a: function (a) {
                        a.attributes.href || (a.attributes.href = a.children[0].value)
                    }, smiley: function (a) {
                        a.name = "img";
                        var b = a.attributes.desc, g = c.smiley_images[CKEDITOR.tools.indexOf(c.smiley_descriptions, b)], g = CKEDITOR.tools.htmlEncode(c.smiley_path + g);
                        a.attributes = {
                            src: g,
                            "data-cke-saved-src": g,
                            title: b,
                            alt: b
                        }
                    }
                }
            });
            a.dataProcessor.htmlFilter.addRules({
                elements: {
                    $: function (b) {
                        var c = b.attributes, g = CKEDITOR.tools.parseCssText(c.style, 1), e, d = b.name;
                        if (d in t)d = t[d]; else if ("span" == d)if (e = g.color)d = "color", e = CKEDITOR.tools.convertRgbToHex(e); else {
                            if (e = g["font-size"])if (c = e.match(/(\d+)%$/))e = c[1], d = "size"
                        } else if ("ol" ==
                            d || "ul" == d) {
                            if (e = g["list-style-type"])switch (e) {
                                case "lower-alpha":
                                    e = "a";
                                    break;
                                case "upper-alpha":
                                    e = "A"
                            } else"ol" == d && (e = 1);
                            d = "list"
                        } else if ("blockquote" == d) {
                            try {
                                var h = b.children[0], j = b.children[1], k = "cite" == h.name && h.children[0].value;
                                k && (e = '"' + k + '"', b.children = j.children)
                            } catch (l) {
                            }
                            d = "quote"
                        } else if ("a" == d) {
                            if (e = c.href)-1 !== e.indexOf("mailto:") ? (d = "email", b.children = [new CKEDITOR.htmlParser.text(e.replace("mailto:", ""))], e = "") : ((d = 1 == b.children.length && b.children[0]) && (d.type == CKEDITOR.NODE_TEXT &&
                            d.value == e) && (e = ""), d = "url")
                        } else if ("img" == d) {
                            b.isEmpty = 0;
                            g = c["data-cke-saved-src"] || c.src;
                            c = c.alt;
                            if (g && -1 != g.indexOf(a.config.smiley_path) && c)return new CKEDITOR.htmlParser.text(n[c]);
                            b.children = [new CKEDITOR.htmlParser.text(g)]
                        }
                        b.name = d;
                        e && (b.attributes.option = e);
                        return null
                    }, br: function (a) {
                        if ((a = a.next) && a.name in w)return !1
                    }
                }
            }, 1);
            a.dataProcessor.writer = r;
            if (a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE)a.once("contentDom", function () {
                a.on("setData", b)
            }); else a.on("setData", b)
        }, afterInit: function (a) {
            var b;
            a._.elementsPath && (b = a._.elementsPath.filters) && b.push(function (b) {
                var h = b.getName(), f = k[h] || !1;
                "link" == f && 0 === b.getAttribute("href").indexOf("mailto:") ? f = "email" : "span" == h ? b.getStyle("font-size") ? f = "size" : b.getStyle("color") && (f = "color") : "img" == f && (b = b.data("cke-saved-src") || b.getAttribute("src")) && 0 === b.indexOf(a.config.smiley_path) && (f = "smiley");
                return f
            })
        }
    })
})();