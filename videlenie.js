document.addEventListener('DOMContentLoaded', function() {
    const regions = document.querySelectorAll('.region');
    const regionInfo = document.getElementById('region-info');
    const regionSelect = document.getElementById('region-select');
    const resetBtn = document.getElementById('reset-btn');
    const regionListItems = document.querySelectorAll('.region-list li');
    let selectedRegion = null;

    // Функция для сброса выделения всех регионов
    function resetSelection() {
        regions.forEach(region => {
            region.classList.remove('selected');
            region.style.fill = '#e0e0e0';
        });

        // Сброс выделения в списке
        regionListItems.forEach(item => {
            item.classList.remove('selected');
        });

        selectedRegion = null;
        if(regionSelect) regionSelect.value = '';
    }

    // Функция для выделения конкретного региона
    function selectRegion(region, regionId = null) {
        resetSelection();

        // Если передано только ID, находим элемент региона
        if (regionId && !region) {
            region = document.getElementById(regionId);
        }

        if (!region) return;

        region.classList.add('selected');
        region.style.fill = '#2196F3';
        selectedRegion = region;

        // Обновляем информацию о регионе
        if (regionInfo) {
            regionInfo.innerHTML = `
                <strong>Выбран регион:</strong> ${region.getAttribute('title')} (ID: ${region.id})
                <p>Нажмите ещё раз, чтобы снять выделение</p>
            `;
        }

        // Прокрутка к выбранному региону
        region.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Выделяем соответствующий элемент в списке
        const listItem = Array.from(regionListItems).find(item =>
            item.textContent.trim() === region.getAttribute('title').trim()
        );
        if (listItem) {
            listItem.classList.add('selected');
        }

        // Обновляем select, если он есть
        if(regionSelect) regionSelect.value = region.id;
    }

    // Обработчики для каждого региона на карте
    regions.forEach(region => {
        // При наведении
        region.addEventListener('mouseover', function() {
            if (!this.classList.contains('selected')) {
                this.style.fill = '#4CAF50';
            }
            if (regionInfo) {
                regionInfo.innerHTML = `<strong>${this.getAttribute('title')}</strong> (ID: ${this.id})`;
            }
        });

        // При уходе курсора
        region.addEventListener('mouseout', function() {
            if (!this.classList.contains('selected')) {
                this.style.fill = '#e0e0e0';
            }
        });

        // При клике
        region.addEventListener('click', function() {
            // Если регион уже выбран, снимаем выделение
            if (selectedRegion === this) {
                resetSelection();
                if (regionInfo) {
                    regionInfo.innerHTML = '<p>Наведите курсор на регион, чтобы увидеть его название</p>';
                }
                return;
            }

            selectRegion(this);
        });
    });

    // Обработчики для элементов списка регионов
    regionListItems.forEach(item => {
        item.addEventListener('click', function() {
            const regionName = this.textContent.trim();
            const region = Array.from(regions).find(r =>
                r.getAttribute('title').trim() === regionName
            );

            if (region) {
                if (selectedRegion === region) {
                    resetSelection();
                    if (regionInfo) {
                        regionInfo.innerHTML = '<p>Наведите курсор на регион, чтобы увидеть его название</p>';
                    }
                } else {
                    selectRegion(region);
                }
            }
        });
    });

    // Обработчик выбора из списка (select)
    if(regionSelect) {
        regionSelect.addEventListener('change', function() {
            if(this.value) {
                selectRegion(null, this.value);
            } else {
                resetSelection();
                if (regionInfo) {
                    regionInfo.innerHTML = '<p>Наведите курсор на регион, чтобы увидеть его название</p>';
                }
            }
        });
    }

    // Обработчик кнопки сброса
    if(resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetSelection();
            if (regionInfo) {
                regionInfo.innerHTML = '<p>Наведите курсор на регион, чтобы увидеть его название</p>';
            }
        });
    }

    // Обработчик клика по карте (не по региону)
    const svgMap = document.querySelector('svg');
    if (svgMap) {
        svgMap.addEventListener('click', function(e) {
            if (e.target === this) {
                resetSelection();
                if (regionInfo) {
                    regionInfo.innerHTML = '<p>Наведите курсор на регион, чтобы увидеть его название</p>';
                }
            }
        });
    }
});