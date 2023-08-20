(()=>{
    console.log('works');

    const prefix = 'popup-id-';
    const preloadClass = 'popup-preload';

    const extractNumberFromClass = className => {
        if ( !className.startsWith(prefix) ) { return null; }
        const id = parseInt(className.substring(prefix.length));
        return !isNaN(id) ? id : null;
    };

    const getTriggers = () => {
        const classNames = document.querySelectorAll('[class*="'+prefix+'"]');
        const ids = [];
    
        classNames.forEach(item => {
            const classList = item.classList;
            const preload = item.className.includes(preloadClass);
            classList.forEach(className => {
                const id = extractNumberFromClass(className);
                if (id !== null) {
                    ids.push({
                        id,
                        preload,
                        item
                    });
                }
            });
        });
    
        return ids.length > 0 ? ids : [];
    };

    const contentStorage = [];
    const fetchContent = async ids => {

        const param = typeof ids === 'number' ? String(ids) : ( Array.isArray(ids) ? ids.join(',') : '' );

        return await fetch(
            `/wp-json/fct/popups/v1/` + param,
            {
                method: 'get'
            }
        )
        .then( response => response.status === 200 && response.json() || [] )
        .then( data => data || [] )
        .catch( error => [] );
    };

    const getContent = async ids => {
        if (!Array.isArray(ids)) {
            ids = [ids]; // Convert to an array if a single id is provided
        }
    
        const missingIds = ids.filter(id => !contentStorage.some(item => item.id === id));
    
        if (missingIds.length > 0) {
            const fetchedContent = await fetchContent(missingIds);
            contentStorage.push(...fetchedContent);
        }
    
        const result = contentStorage.filter(item => ids.includes(item.id));
    
        return result;
    };

    const preload = () => {
        const triggers = getTriggers();
        const ids = triggers.length ? triggers.filter( a => a.preload === true )?.map( a => a.id ) : [];
    };
    const dolog = async () => {
        console.log('fetches');
        const data = await fetchContent([391, 349]);
        console.log( data );
    };
    dolog();

})();