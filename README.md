# Direct MEGA
MEGA downloads working like normal downloads!

![Screenshot](https://i.imgur.com/750OurF.png)

[Download the file above](https://direct-mega.openode.io/?!MAsFwa4b!d8o1uz6SffMAATSQmERLIYITkyc-eTbKQ6xqI3IQSms) or [watch it](https://direct-mega.openode.io/view?!MAsFwa4b!d8o1uz6SffMAATSQmERLIYITkyc-eTbKQ6xqI3IQSms) ([original link](https://mega.nz/#!MAsFwa4b!d8o1uz6SffMAATSQmERLIYITkyc-eTbKQ6xqI3IQSms)).

## How to use:

When downloading a file replace `https://mega.nz` with `https://direct-mega.openode.io`.
 *Everything works in your computer* and you can download anything directly from MEGA.

You can view files, if your browser supports then, by using `view` before the `#` part.
Folders are also supported: a link to a folder will show a list the files inside it so you can download or view one of those.

## Warning:

This website **don't** bypass any bandwidth quota.  
But you can use the splitter to workaround that: https://direct-mega.openode.io/splitter

## FAQ:

* **Q:** Why downloading don't work?  
**A:** If it's not downloading then there's a bug: clear your browser cache.  
If it still don't works open an issue (or find other way to contact the developers).
* **Q:** Where is the direct link?  
**A:** MEGA files are encrypted, so there's no direct link. But this website skips the "start download"
button and starts download immediately, so it's *almost* direct.
* **Q:** Can I use it in some download manager?  
**A:** It works using JavaScript, so no. If you open it in any download manager it will only download an HTML page and nothing else.
* **Q:** How it works?  
**A:** Downloading like the image shows uses Service Workers and Streams API.
Currently few browsers supports that, like [Google Chrome / Chromium](https://www.chromestatus.com/feature/4531143755956224).
In other browsers it uses `Blob` and `a[download]` (similar to MEGA).

## Extra arguments

* `&use-http-range`: uses the HTTP Range header which allows video and music seeking
(disabled by default as it can cause bugs and currently have bad performance)
* `&start=X`: starts downloading from the X part of the file (default unit: byte)
* `&end=X`: stops downloading at the X part of the file (default unit: byte)
* `&name=X`: rename files downloaded
* `&cipher`: downloads the encrypted file, [in most cases](https://direct-mega.openode.io/view?F!g4FlSYTZ!!MwEgnajY&c=kaban.png)
it's not needed and will cause bugs
