// When DOI is empty, get DOI from URL
// 当DOI为空时，通过URL中获取DOI
// @author Seking
// Fill DOI from URL
// Name : Fill DOI from URL
// Event : None
// Operation : Script
// Data : JS code below
// Shortcut: None
// Menu Label: Fill DOI from URL
// V 0.1

// 获取当前活动的Zotero窗格
var ZoteroPane = Zotero.getActiveZoteroPane();

// 获取当前选定的条目
var selectedItems = ZoteroPane.getSelectedItems();

// 检查是否有选定的条目
if (selectedItems.length > 0) {
    // 遍历所有选定的条目
    for (var i = 0; i < selectedItems.length; i++) {
        var item = selectedItems[i];

        // 获取条目的URL
        var url = item.getField('url');

        // 检查URL是否存在
        if (url) {
            // 尝试从条目中获取DOI
            var doi = item.getField('DOI');

            // 如果DOI字段为空白，则尝试从网页内容中获取DOI
            if (!doi) {
                try {
                    var response = await Zotero.HTTP.request("GET", url);
                    if (response.status == 200) {
                        var parser = new DOMParser();
                        var htmlDoc = parser.parseFromString(response.responseText, "text/html");
                        var doiElement = htmlDoc.querySelector('meta[name="citation_doi"]');

                        if (doiElement) {
                            doi = doiElement.content;
                        } else {
                            // 如果没有找到meta标签，尝试使用正则表达式匹配DOI
                            var doiRegex = /(10\.\d{4,9}\/[-._;()\/:A-Z0-9]+)/i;
                            var match = response.responseText.match(doiRegex);
                            if (match && match[1]) {
                                doi = match[1];
                            }
                        }
                    }
                } catch (e) {
                    Zotero.debug(e);
                }

                if (doi) {
                    // 将获取的DOI填入条目的DOI字段
                    item.setField('DOI', doi);
                    await item.saveTx();
                }
            }

            // 检查DOI是否不为空且itemType不是journalArticle
            if (doi && item.itemType !== 'journalArticle') {
                // 修改itemType为journalArticle
                item.setType('journalArticle');
                await item.saveTx();
            }
        }
    }

    // 所有条目处理完成后显示自定义通知
    Zotero.Notifier.trigger("add", "notification", {
        type: "progress",
        message: "DOI matching completed",
        icon: "chrome://zotero/skin/tick.png",
        timeout: 5000
    });
} else {
    alert("No item selected.");
}
