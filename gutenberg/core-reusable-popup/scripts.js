(async () => {

    // fetching popup contents

    const POPUP_ID_PREFIX = 'popup-id-';
    const PRELOAD_CLASS = 'popup-preload';

    const extractNumberFromClass = className => {
        if (!className.startsWith(POPUP_ID_PREFIX)) {
            return null;
        }
        const id = parseInt(className.substring(POPUP_ID_PREFIX.length));
        return !isNaN(id) ? id : null;
    };
    const actualTriggerElement = el => {
        const tagName = el.tagName.toLowerCase();
        const possibleTriggers = ['a', 'button'];
        if (possibleTriggers.includes(tagName)) { return el }
        return el.querySelector(possibleTriggers.join(',')) || el;
    };

    let triggers = [];
    const getTriggers = () => {
        triggers = [];
        const triggerElements = document.querySelectorAll(`[class*="${POPUP_ID_PREFIX}"]`);

        triggerElements.forEach(element => {
            const classList = element.classList;
            const isPreload = classList.contains(PRELOAD_CLASS);
            const actualElement = actualTriggerElement(element);

            classList.forEach(className => {
                const id = extractNumberFromClass(className);
                if (id !== null) {
                    triggers.push({
                        id,
                        isPreload,
                        element, // works as parent if has button or a child
                        actualElement
                    });
                }
            });
        });

        return triggers;
    };

    let contentStorage = [];
    const fetchContent = async ids => {
        const param = Array.isArray(ids) ? ids.join(',') : String(ids);

        try {
            const response = await fetch(`/wp-json/fct/popups/v1/${param}`, {
                method: 'get'
            });

            if (response.status === 200) {
                const data = await response.json();
                return data || [];
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        }

        return [];
    };

    const getContent = async ids => {
        if (!ids) { return }
        if (!Array.isArray(ids)) {
            ids = [ids];
        }

        const missingIds = ids.filter(id => !contentStorage.some(item => item.id === id));

        if (missingIds.length > 0) {
            const fetchedContent = await fetchContent(missingIds);
            contentStorage.push(...fetchedContent);
        }

        return contentStorage.filter(item => ids.some(id => item.id === id));
    };

    const preload = async () => {
        const triggers = getTriggers();
        const preloadTriggers = triggers.filter(trigger => trigger.isPreload);

        if (preloadTriggers.length > 0) {
            const preloadIds = preloadTriggers.map(trigger => trigger.id);
            await getContent(preloadIds);
        }
    };

    await preload();


    // popup wrapper

    // spread click events
    triggers.forEach(trigger => {
        const el = trigger.actualElement;

        const openPopup = e => {
            e.preventDefault();
            setTimeout(openPopupReal);
        };
        const openPopupReal = () => {
            // the trigger changes
            el.setAttribute('aria-expanded', 'true');
            setTimeout(() => { document.addEventListener('click', closePopup) });
            // keyboard event
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape') {
                    closePopup();
                }
            });
            // the popup changes
            makeModal(trigger.id);
        };

        const closePopup = () => {
            // the trigger changes
            el.setAttribute('aria-expanded', 'false');
            document.removeEventListener('click', closePopup);
            // the popup changes
            deleteModal();
        };

        el.setAttribute('aria-haspopup', 'true');
        el.setAttribute('aria-expanded', 'false');
        el.addEventListener('click', openPopup);
    });

    // create the popup modal / dialog
    let dialog;
    const makeModal = async id => {

        // create the modal
        dialog = document.createElement('div');
        dialog.className = 'popup-modal';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('tabindex', '-1');

        // get the content
        const data = await getContent(id);
        const content = data?.length && data[0];
        if (content.id !== id) { return }

        // print the content details
        dialog.setAttribute('aria-label', content.title);
        dialog.innerHTML = content.content;

        const parent = document.querySelector('main#main');
        parent.insertAdjacentElement('beforeend', dialog); // ++ can add the loader inside the div if it is created nd shown before async

    };

    const deleteModal = () => {
        dialog?.remove();
    };

})();
