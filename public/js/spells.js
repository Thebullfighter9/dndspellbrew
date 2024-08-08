document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const categorySelect = document.getElementById('category-select');
    const spellList = document.getElementById('spell-list');
    const postSpellButton = document.getElementById('post-spell-button');
    const postSpellForm = document.getElementById('post-spell-form');
    const spellForm = document.getElementById('spell-form');
    const cancelPostSpell = document.getElementById('cancel-post-spell');
    const addVariationButton = document.getElementById('add-variation');

    const fetchSpells = () => {
        fetch('/api/spells')
            .then(response => response.json())
            .then(spells => {
                spellList.innerHTML = '';
                spells.forEach(spell => {
                    const spellCard = document.createElement('div');
                    spellCard.className = 'spell-card';
                    spellCard.innerHTML = `
                        <div class="spell-card-front">
                            <h3>${spell.name}</h3>
                            <p><strong>Level:</strong> ${spell.level}</p>
                            <p><strong>School:</strong> ${spell.school}</p>
                            <p><strong>Class:</strong> ${spell.class.join(', ')}</p>
                            <p><strong>Casting Time:</strong> ${spell.castingTime}</p>
                            <p><strong>Range:</strong> ${spell.range}</p>
                            <p><strong>Components:</strong> ${spell.components}</p>
                            <p><strong>Duration:</strong> ${spell.duration}</p>
                            <p><strong>Required Level:</strong> ${spell.requiredLevel}</p>
                            <p><strong>Username:</strong> ${spell.username}</p>
                            ${spell.variations.map(variation => `
                                <div class="variation">
                                    <p><strong>Variation Level:</strong> ${variation.level}</p>
                                    <p>${variation.description}</p>
                                </div>
                            `).join('')}
                            <button class="edit-spell-button" data-id="${spell._id}">Edit</button>
                        </div>
                        <div class="spell-card-back">
                            <p>${spell.description}</p>
                        </div>
                    `;
                    spellList.appendChild(spellCard);
                });
                document.querySelectorAll('.edit-spell-button').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const spellId = event.target.getAttribute('data-id');
                        editSpell(spellId);
                    });
                });
            })
            .catch(err => console.error('Error fetching spells:', err));
    };

    const togglePostSpellForm = () => {
        postSpellForm.style.display = postSpellForm.style.display === 'none' ? 'block' : 'none';
    };

    const addVariation = () => {
        const variationDiv = document.createElement('div');
        variationDiv.className = 'variation';
        variationDiv.innerHTML = `
            <label for="variation-level">Variation Level:</label>
            <select class="variation-level" name="variation-level">
                <option value="Cantrip">Cantrip</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
            </select>
            <label for="variation-description">Variation Description:</label>
            <textarea class="variation-description" name="variation-description"></textarea>
        `;
        document.getElementById('variations').appendChild(variationDiv);
    };

    const editSpell = (spellId) => {
        fetch(`/api/spells/${spellId}`)
            .then(response => response.json())
            .then(spell => {
                document.getElementById('spell-name').value = spell.name;
                document.getElementById('spell-description').value = spell.description;
                document.getElementById('spell-level').value = spell.level;
                document.getElementById('spell-school').value = spell.school;
                document.getElementById('spell-damage-type').value = spell.damageType;
                document.getElementById('spell-class').value = spell.class.join(', ');
                document.getElementById('spell-casting-time').value = spell.castingTime;
                document.getElementById('spell-range').value = spell.range;
                document.getElementById('spell-components').value = spell.components;
                document.getElementById('spell-duration').value = spell.duration;
                document.getElementById('spell-required-level').value = spell.requiredLevel;
                document.getElementById('spell-username').value = spell.username;
                document.getElementById('variations').innerHTML = spell.variations.map(variation => `
                    <div class="variation">
                        <label for="variation-level">Variation Level:</label>
                        <select class="variation-level" name="variation-level" value="${variation.level}">
                            <option value="Cantrip" ${variation.level === 'Cantrip' ? 'selected' : ''}>Cantrip</option>
                            <option value="1" ${variation.level === '1' ? 'selected' : ''}>1</option>
                            <option value="2" ${variation.level === '2' ? 'selected' : ''}>2</option>
                            <option value="3" ${variation.level === '3' ? 'selected' : ''}>3</option>
                            <option value="4" ${variation.level === '4' ? 'selected' : ''}>4</option>
                            <option value="5" ${variation.level === '5' ? 'selected' : ''}>5</option>
                            <option value="6" ${variation.level === '6' ? 'selected' : ''}>6</option>
                            <option value="7" ${variation.level === '7' ? 'selected' : ''}>7</option>
                            <option value="8" ${variation.level === '8' ? 'selected' : ''}>8</option>
                            <option value="9" ${variation.level === '9' ? 'selected' : ''}>9</option>
                        </select>
                        <label for="variation-description">Variation Description:</label>
                        <textarea class="variation-description" name="variation-description">${variation.description}</textarea>
                    </div>
                `).join('');
                togglePostSpellForm();
                spellForm.onsubmit = (event) => {
                    event.preventDefault();
                    updateSpell(spellId);
                };
            })
            .catch(err => console.error('Error fetching spell:', err));
    };

    const updateSpell = (spellId) => {
        const formData = new FormData(spellForm);
        const spellData = {};
        formData.forEach((value, key) => {
            if (key.startsWith('variation-')) {
                const index = key.split('-')[1];
                if (!spellData.variations) spellData.variations = [];
                if (!spellData.variations[index]) spellData.variations[index] = {};
                spellData.variations[index][key.split('-')[2]] = value;
            } else if (key === 'class') {
                spellData[key] = value.split(',').map(item => item.trim());
            } else {
                spellData[key] = value;
            }
        });

        fetch(`/api/spells/${spellId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(spellData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Spell updated:', data);
            togglePostSpellForm();
            fetchSpells();
        })
        .catch(err => console.error('Error updating spell:', err));
    };

    spellForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(spellForm);
        const spellData = {};
        formData.forEach((value, key) => {
            if (key.startsWith('variation-')) {
                const index = key.split('-')[1];
                if (!spellData.variations) spellData.variations = [];
                if (!spellData.variations[index]) spellData.variations[index] = {};
                spellData.variations[index][key.split('-')[2]] = value;
            } else if (key === 'class') {
                spellData[key] = value.split(',').map(item => item.trim());
            } else {
                spellData[key] = value;
            }
        });

        fetch('/api/spells', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(spellData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Spell posted:', data);
            togglePostSpellForm();
            fetchSpells();
        })
        .catch(err => console.error('Error posting spell:', err));
    });

    searchBar.addEventListener('input', fetchSpells);
    categorySelect.addEventListener('change', fetchSpells);
    postSpellButton.addEventListener('click', togglePostSpellForm);
    cancelPostSpell.addEventListener('click', togglePostSpellForm);
    addVariationButton.addEventListener('click', addVariation);

    fetchSpells();
});
