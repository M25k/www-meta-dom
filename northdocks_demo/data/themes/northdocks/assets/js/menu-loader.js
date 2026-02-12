function loadMenu(relativePath, activePageId) {
    var menuItems = [
        { id: 'home', text: 'Wer wir sind', link: '' },
        { id: 'digitaler-zwilling', text: 'Digitaler Zwilling', link: 'digitaler-zwilling/' },
        { id: 'virtual-reality', text: 'Virtual Reality', link: 'virtual-reality-training-und-ausbildung/' },
        { id: 'firefighter-vr', text: 'Firefighter VR', link: 'https://firefightervr.de/', target: '_blank' },
        { id: 'radiation-vr', text: 'Strahlenschutz VR', link: 'https://radiationprotectionvr.com/', target: '_blank' },
        { id: '3d-experience', text: '3D Erlebniswelten', link: '3d-experience/' },
        { id: 'kontakt', text: 'Kontakt', link: 'kontakt/' },
        { id: 'impressum', text: 'Impressum', link: 'impressum/' },
        { id: 'datenschutz', text: 'Datenschutz', link: 'datenschutz/' }
    ];

    var menuContainer = document.getElementById('menu-main-menu');
    if (!menuContainer) return;

    // Clear existing content
    menuContainer.innerHTML = '';

    menuItems.forEach(function (item) {
        var li = document.createElement('li');
        li.className = 'menu-item menu-item-type-post_type menu-item-object-page';

        if (item.id === activePageId) {
            li.classList.add('current-menu-item', 'page_item', 'current_page_item');
        }

        var a = document.createElement('a');

        if (item.link.startsWith('http')) {
            a.href = item.link;
        } else {
            a.href = relativePath + item.link;
        }

        if (item.target) {
            a.target = item.target;
            a.rel = "noopener";
        }

        a.textContent = item.text;
        li.appendChild(a);
        menuContainer.appendChild(li);
    });
}
