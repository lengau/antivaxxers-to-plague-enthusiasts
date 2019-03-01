function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
  textNode.nodeValue = replaceText(textNode.nodeValue);
}

function replaceText(v)
{
    // Fix some misspellings
    //v = v.replace(/\b(A|a)nti(V|v)axxer(s)?\b/g, "$1nti-$2axxer$3");
    //v = v.replace(/\b(A|a)nti (V|v)axxer(s)?\b/g, "$1nti-$2axxer$3");
    v = v.replace(/\b(A|a)nti(\s|-|)(V|v)ax+/g, "$1nti-$3axx");
    v = v.replace(/\b(A|a)nti-(V|v)ax+/g, "$1nti-$2axx");

    // Pro- and anti-vaxx
    v = v.replace(/\b(P|p)ro- and Anti-vaxx\b/g, "$1ro-humanity and Pro-plague");
    v = v.replace(/\b(P|p)ro- and anti-vaxx\b/g, "$1ro-humanity and pro-plague");

    // Anti-Vaxxer, an anti-vaxxer
    v = v.replace(/\b(A|a)n Anti-vaxxer(s?)\b/g, "$1 Plague enthusiast$2");
    v = v.replace(/\b(A|a)n Anti-Vaxxer(s?)\b/g, "$1 Plague Enthusiast$2");
    v = v.replace(/\b(A|a)n anti-vaxxer(s?)\b/g, "$1 plague enthusiast$2");
    v = v.replace(/\bAnti-vaxxer(s?)\b/g, "Plague enthusiast$1");
    v = v.replace(/\bAnti-Vaxxer(s?)\b/g, "Plague Enthusiast$1");
    v = v.replace(/\banti-vaxxer(s?)\b/g, "plague enthusiast$1");

    // plurals and possessive
    v = v.replace(/\bAnti-vaxxer(?:(s)\b(')|s\b)/g, "Plague enthusiast$2$1");
    v = v.replace(/\bAnti-Vaxxer(?:(s)\b(')|s\b)/g, "Plague Enthusiast$2$1");
    v = v.replace(/\banti-vaxxer(?:(s)\b(')|s\b)/g, "plague enthusiast$2$1");

    // Definition
    // TODO: Figure out how these should be converted.
    // v = v.replace(/\bmil·len·nial\b/g, "snake peo·ple");
    // v = v.replace(/\bmiˈlenēəl\b/g, "snāk ˈpēpəl");

    // Anti-vaccination movement
    v = v.replace(/\b(A|a)n Anti-(V|v)accination\b/g, "$1 Plague Enthusiasm");
    v = v.replace(/\b(A|a)n anti-vaccination\b/g, "$1 plague enthusiasm");
    v = v.replace(/\bAnti-Vaccination\b/g, "Plague Enthusiasm");
    v = v.replace(/\bAnti-vaccination\b/g, "Plague enthusiasm");
    v = v.replace(/\banti-vaccination\b/g, "plague enthusiasm");

    // Anti-vaccinationism
    v = v.replace(/\bAnti-vaccinationism\b/g, "Yersinia pestisism");
    v = v.replace(/\banti-vaccinationism\b/g, "yersinia pestisism");

    // Anti-vaccine
    v = v.replace(/\b(A|a)n Anti-Vaccine\b/g, "$1 Pro-Plague");
    v = v.replace(/\b(A|a)n Anti-vaccine\b/g, "$1 Pro-plague");
    v = v.replace(/\b(A|a)n anti-vaccine\b/g, "$1 pro-plague");
    v = v.replace(/\bAnti-Vaccine\b/g, "Pro-Plague");
    v = v.replace(/\bAnti-vaccine\b/g, "Pro-plague");
    v = v.replace(/\banti-vaccine\b/g, "pro-plague");

    // Anti-vaxx
    v = v.replace(/\bAnti-Vaxx\b/g, 'Pro-Plague');
    v = v.replace(/\bAnti-vaxx\b/g, 'Pro-plague');
    v = v.replace(/\banti-vaxx\b/g, 'pro-plague');

    // Anti-immunization
    v = v.replace(/\bAnti(\s|-|)Immuni(s|z)ation\b/g, "Pro-Disease");
    v = v.replace(/\bAnti(\s|-|)immuni(s|z)ation\b/g, "Pro-disease");
    v = v.replace(/\banti(\s|-|)immuni(s|z)ation\b/g, "pro-disease");

    return v;
}

// Returns true if a node should *not* be altered in any way
function isForbiddenNode(node) {
    return node.isContentEditable || // DraftJS and many others
    (node.parentNode && node.parentNode.isContentEditable) || // Special case for Gmail
    (node.tagName && (node.tagName.toLowerCase() == "textarea" || // Some catch-alls
                     node.tagName.toLowerCase() == "input"));
}

// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i, node;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            node = mutation.addedNodes[i];
            if (isForbiddenNode(node)) {
                // Should never operate on user-editable content
                continue;
            } else if (node.nodeType === 3) {
                // Replace the text for text nodes
                handleText(node);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(node);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}
walkAndObserve(document);
