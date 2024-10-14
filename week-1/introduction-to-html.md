# Introduction to HTML

#### Objectives:

* Understand the structure and purpose of HTML.
* Learn basic HTML tags (headings, paragraphs, links, images).

### What is HTML <a href="#what_is_html" id="what_is_html"></a>

HTML (HyperText Markup Language) is a _markup language_ that tells web browsers how to structure the web pages you visit. It can be as complicated or as simple as the web developer wants it to be.

We do this using code elements called \`tags\`.

```html
<p>Hello world!<p> <!-- This is a paragraph tag saying 'Hello world!' -->
```

The type of tag enclosing an HTML content determines how it would appear and act.

{% hint style="info" %}
**Note:** Tags in HTML are not case-sensitive. This means they can be written in uppercase or lowercase. For example, a [`<title>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) tag could be written as `<title>`, `<TITLE>`, `<Title>`, `<TiTlE>`, etc., and it will work. However, it is best practice to write all tags in lowercase for consistency and readability.
{% endhint %}

#### Anatomy of an HTML elements

<figure><img src="../.gitbook/assets/grumpy-cat-small.png" alt=""><figcaption><p>anatomony of an html element from mdn docs</p></figcaption></figure>



The anatomy of our element is:

* **The opening tag:** This consists of the name of the element (in this example, _p_ for paragraph), wrapped in opening and closing angle brackets. This opening tag marks where the element begins or starts to take effect. In this example, it precedes the start of the paragraph text.
* **The content:** This is the content of the element. In this example, it is the paragraph text.
* **The closing tag:** This is the same as the opening tag, except that it includes a forward slash before the element name. This marks where the element ends. Failing to include a closing tag is a common beginner error that can produce peculiar results.

The element is the opening tag, followed by content, followed by the closing tag.

### Attributes

Elements can also have attributes. Attributes look like this:

<figure><img src="../.gitbook/assets/grumpy-cat-attribute-small.png" alt=""><figcaption></figcaption></figure>

Attributes contain extra information about the element that won't appear in the content. In this example, the **`class`** attribute is an identifying name used to target the element when applying a CSS style.

An attribute should have:

* A space between it and the element name. (For an element with more than one attribute, the attributes should be separated by spaces too.)
* The attribute name, followed by an equal sign.
* An attribute value, wrapped with opening and closing quote marks.

Live Practice - Building Your first Website
