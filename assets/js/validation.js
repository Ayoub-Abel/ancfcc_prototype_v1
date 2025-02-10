document.addEventListener('DOMContentLoaded', () => {

    var captchaConfirmed = false;

    const arabicKeys = [
        "ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د",
        "ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط", "ذ",
        "ئ", "ء", "ؤ", "ر", "ى", "ة", "و", "ز", "ظ"
    ];

    const createKeyboard = (inputField) => {
        const keyboardContainer = inputField.parentElement.querySelector('.keyboardContainer');
        keyboardContainer.innerHTML = '';  // Clear the container before adding the keyboard

        arabicKeys.forEach(key => {
            const keyButton = document.createElement('span');
            keyButton.classList.add('key');
            keyButton.innerText = key;
            keyboardContainer.appendChild(keyButton);
        });

        const spaceButton = createKeyButton('Espace', '80%', ['key', 'wide-key']);
        const deleteButton = createKeyButton('Suppr', '14%', ['key', 'wide-key']);

        keyboardContainer.appendChild(spaceButton);
        keyboardContainer.appendChild(deleteButton);

        addKeyboardEventListeners(inputField, keyboardContainer, spaceButton, deleteButton);
    };

    const createKeyButton = (text, width, classes) => {
        const button = document.createElement('span');
        button.innerText = text;
        button.style.width = width;
        button.classList.add(...classes);
        return button;
    };

    const addKeyboardEventListeners = (inputField, keyboardContainer, spaceButton, deleteButton) => {
        spaceButton.addEventListener('click', () => inputField.value += " ");
        deleteButton.addEventListener('click', () => inputField.value = inputField.value.slice(0, -1));

        keyboardContainer.querySelectorAll('.key').forEach(button => {
            button.addEventListener('click', () => {
                if (button.innerText !== 'Espace' && button.innerText !== 'Suppr') {
                    inputField.value += button.innerText;
                }
            });
        });
    };

    const handleInputFocus = (inputField) => {
        document.querySelectorAll('.keyboardContainer').forEach(container => container.style.display = 'none');
        const keyboardContainer = inputField.parentElement.querySelector('.keyboardContainer');
        keyboardContainer.style.display = 'flex';
        createKeyboard(inputField);
    };

    const handleInputBlur = (inputField, event) => {
        if (!event.relatedTarget || !event.relatedTarget.classList.contains('key')) {
            const keyboardContainer = inputField.parentElement.querySelector('.keyboardContainer');
            keyboardContainer.style.display = 'none';
        }
    };

    const handleInputValidation = (inputField, regex, message) => {
        inputField.addEventListener('input', (event) => {
            let value = event.target.value;
            if (!regex.test(value)) {
                if (!inputField.classList.contains('inputs-email')) {
                    event.target.value = value.slice(0, -1);
                }

                showWarningInputs(inputField, message);
            }
        });
    };

    const handleRequiredField = (inputField) => {
        inputField.addEventListener('blur', () => {
            if (!inputField.value.trim()) {
                showAlertInputs(inputField, 'Champ requis');
            } else {
                hideAlertInputs(inputField);
            }
        });
    };

    document.querySelectorAll('.btn-steps').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            let allValid = true;
            let inputsFieldsSet;
            switch (button.id) {
                case "next2":
                    inputsFieldsSet = document.querySelectorAll('#step1 input.input-req');
                    break;
                // case "next3":
                //     inputsFieldsSet = document.querySelectorAll('#step2 .input-req');
                //     break;
            }

            inputsFieldsSet.forEach(inputField => {
                const isProfessionnelField = inputField.closest('.professionnel-fields');
                const isParticulierChecked = document.querySelector('input[name="type-demandeur"]:checked').value === 'particulier';

                if (isParticulierChecked && isProfessionnelField) {
                    return; // Skip validation for professionnel fields if particulier is checked
                }

                if (!inputField.value.trim()) {
                    showAlertInputs(inputField, 'Champ requis');
                    allValid = false;
                } else {
                    hideAlertInputs(inputField);
                }
            });


            const emailInput = document.querySelector('.inputs-email');
            if (emailInput && emailInput.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                showWarningInputs(emailInput, "Adresse e-mail invalide");
                allValid = false;
            }

            const frInputs = document.querySelectorAll('.inputs-fr');
            frInputs.forEach(frInput => {
                if (frInput.value.trim() && !/^[a-zA-Z\s]*$/.test(frInput.value)) {
                    showWarningInputs(frInput, "Seuls les caractères latins sont autorisés");
                    allValid = false;
                }
            });

            document.querySelectorAll('.inputs-ar').forEach(arInput => {
                if (arInput.value.trim() && !/^[\u0600-\u06FF\s]*$/.test(arInput.value)) {
                    showWarningInputs(arInput, "Seuls les caractères arabes sont autorisés");
                    allValid = false;
                }
            });

            document.querySelectorAll('.inputs-number').forEach(numberInput => {
                if (numberInput.value.trim() && !/^[0-9]*$/.test(numberInput.value)) {
                    showWarningInputs(numberInput, "Seuls les chiffres sont autorisés");
                    allValid = false;
                }
            });

            document.querySelectorAll('.inputs-alphanum').forEach(alphanumInput => {
                if (alphanumInput.value.trim() && !/^[a-zA-Z0-9\s]*$/.test(alphanumInput.value)) {
                    showWarningInputs(alphanumInput, "Seuls les caractères alphanumériques sont autorisés");
                    allValid = false;
                }
            });

            const legalMentionsCheckbox = document.getElementById('legal-mentions');
            if (legalMentionsCheckbox && !legalMentionsCheckbox.checked) {
                showNotification("Vous devez accepter les mentions légales", 'warning');
                legalMentionsCheckbox.style.boxShadow = 'red 0px 0px 7px 3px';
                allValid = false;
            } else {
                legalMentionsCheckbox.style.boxShadow = 'none';
            }

            if (captchaConfirmed == false) {
                showNotification("Veuillez confirmer que vous n'êtes pas un robot", 'warning');
                document.querySelector('.slidercaptcha').style.boxShadow = 'red 0px 0px 7px 3px';

                allValid = false;
            } 

            if (allValid) {
                if (button.id === 'next2') {

                    fadeOut(document.getElementById('step1'), () => {
                        document.getElementById('step1').classList.add('d-none');
                        document.getElementById('step2').classList.remove('d-none');
                        fadeIn(document.getElementById('step2'));

                        document.querySelector('#st1').classList.remove('active');
                        document.querySelector('#st2').classList.add('active');
                        document.querySelector('#st1').classList.add('passed');
                    });
                }
                // else if (button.id === 'next3') {
                //     fadeOut(document.getElementById('step2'), () => {
                //         document.getElementById('step2').classList.add('d-none');
                //         document.getElementById('step3').classList.remove('d-none');
                //         fadeIn(document.getElementById('step3'));

                //         document.querySelector('#st2').classList.remove('active');
                //         document.querySelector('#st3').classList.add('active');
                //     });
                // } 
            }
        });
    });


    document.getElementById('addTitreFoncier').addEventListener('click', (event) => {
        event.preventDefault();
        let allValid = true;

        document.querySelectorAll('#step2 .input-req').forEach(inputField => {
            const isProfessionnelField = inputField.closest('.professionnel-fields');
            const isParticulierChecked = document.querySelector('input[name="type-demandeur"]:checked').value === 'particulier';

            if (isParticulierChecked && isProfessionnelField) {
                return; // Skip validation for professionnel fields if particulier is checked
            }

            if (!inputField.value.trim()) {
                showAlertInputs(inputField, 'Champ requis');
                allValid = false;
            } else {
                hideAlertInputs(inputField);
            }
        });

        if (allValid) {

            const conservation = document.getElementById('DropDownConservation');
            const numTitre = document.getElementById('num-titre').value;
            const indice = document.getElementById('id-indice');
            const indiceSpecial = document.getElementById('id-indice-special');

            const tableBody = document.getElementById('titreFoncierTableBody');
            const newRowContent = (indiceSpecial.options[indiceSpecial.selectedIndex].text == "") ?
                `${numTitre}/${indice.options[indice.selectedIndex].text}` :
                `${numTitre}/${indice.options[indice.selectedIndex].text}/${indiceSpecial.options[indiceSpecial.selectedIndex].text}`;

            // Check for duplicate row
            let isDuplicate = false;
            tableBody.querySelectorAll('tr').forEach(row => {
                if (row.cells[1].innerText === newRowContent && row.cells[2].innerText === conservation.options[conservation.selectedIndex].text) {
                    isDuplicate = true;
                }
            });

            if (isDuplicate) {
                showNotification(`Titre foncier "${newRowContent}" déjà ajouté à la liste  !!`, 'warning');
                return;
            }

            checkAccessConditions(newRowContent, conservation, tableBody);


        }
    });

    let accessCount = 0;
    const checkAccessConditions = (newRowContent = '', conservation = '', tableBody = '') => {
        accessCount++;
        showPreloader('Vérification du titre foncier...');
        if (accessCount === 1) {
            // First time access condition

            setTimeout(() => {
                showNotification('Erreur lors de la vérification du titre foncier !!', 'danger');
            }, 2000);
        } else if (accessCount === 2) {
            // Second time access condition
            setTimeout(() => {
                showNotification(`Titre foncier "${newRowContent}" non disponible  !!`, 'warning');
            }, 2000);
        } else if (accessCount >= 3) {

            setTimeout(() => {
                showNotification(`Titre foncier "${newRowContent}" disponible`, 'success');
            }, 2000);

            // Proceed with adding the new row
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
            <td class="text-center"><i class="fa-solid fa-circle-check text-success "></i></td>
            <td>${newRowContent}</td>
            <td>${conservation.options[conservation.selectedIndex].text}</td>
            <td><i class="fa-duotone fa-solid fa-trash remove-titre text-danger"></i></td>
        `;

            tableBody.appendChild(newRow);
            document.querySelector('.list-titre-added table').style.display = 'table';


            // Disable the dropdown
            conservation.disabled = true;

            // Clear the form fields
            document.getElementById('num-titre').value = '';
            document.getElementById('id-indice').value = '';
            document.getElementById('id-indice-special').value = '';

            // Add event listener to the remove button
            newRow.querySelector('.remove-titre').addEventListener('click', function () {
                newRow.remove();
                // Enable the dropdown if the table is empty
                if (tableBody.children.length === 0) {
                    conservation.disabled = false;
                }
            });

            accessCount = 0; // Reset the count to loop
        }
        closePreloader()
    };



    document.querySelectorAll('.btn-preview').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            switch (button.id) {
                case "prev1":
                    fadeOut(document.getElementById('step2'), () => {
                        document.getElementById('step2').classList.add('d-none');
                        document.getElementById('step1').classList.remove('d-none');
                        fadeIn(document.getElementById('step1'));

                        document.querySelector('#st1').classList.add('active');
                        document.querySelector('#st2').classList.remove('active');
                    });
                    break;
                case "prev2":
                    fadeOut(document.getElementById('step3'), () => {
                        document.getElementById('step3').classList.add('d-none');
                        document.getElementById('step2').classList.remove('d-none');
                        fadeIn(document.getElementById('step2'));

                        document.querySelector('#st2').classList.add('active');
                        document.querySelector('#st3').classList.remove('active');
                    });
                    break;
                // Add more cases for other steps if needed
            }
        });
    });

    const fadeOut = (element, callback) => {
        element.style.opacity = 1;
        element.style.transition = 'opacity 0.5s ease';

        requestAnimationFrame(() => {
            element.style.opacity = 0;
            setTimeout(() => {
                if (callback) callback();
            }, 500);
        });
    };

    const fadeIn = (element) => {
        element.style.opacity = 0;
        element.style.transition = 'opacity 0.5s ease';
        element.classList.remove('d-none');

        requestAnimationFrame(() => {
            element.style.opacity = 1;
        });
    };









    const showAlertInputs = (inputField, message) => {
        const alert = createMessageElement('alert-message', message);
        if (!inputField.parentElement.querySelector('.alert-message')) {
            inputField.parentElement.append(alert);
            requestAnimationFrame(() => alert.style.opacity = '1');
        }
        inputField.style.borderColor = 'red';

    };

    const hideAlertInputs = (inputField) => {
        const alert = inputField.parentElement.querySelector('.alert-message');
        if (alert) {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 1500);

            inputField.style.borderColor = '#dee2e6';

        }
    };

    const showWarningInputs = (inputField, message) => {
        const warning = createMessageElement('warning-message', message);
        if (!inputField.parentElement.querySelector('.warning-message')) {
            inputField.parentElement.append(warning);
            requestAnimationFrame(() => warning.style.opacity = '1');
            setTimeout(() => warning.remove(), 1500);
        }
    };

    const createMessageElement = (className, message) => {
        const element = document.createElement('div');
        element.classList.add(className);
        switch (className) {
            case "warning-message":
                element.innerHTML = `<i class="fa-solid fa-circle-exclamation me-1"></i>${message}`;
                break;
            case "alert-message":
                element.innerHTML = `<i class="fa-solid fa-triangle-exclamation me-1"></i>${message}`;
                break;
        }

        element.style.opacity = '0';
        element.style.transition = 'opacity 0.3s ease';
        return element;
    };

    document.querySelectorAll('.inputs-ar').forEach(inputField => {
        inputField.addEventListener('focus', () => handleInputFocus(inputField));
        inputField.addEventListener('blur', (event) => handleInputBlur(inputField, event));
        inputField.parentElement.querySelector('.keyboardContainer').addEventListener('mousedown', (event) => event.preventDefault());
        handleInputValidation(inputField, /^[\u0600-\u06FF\s]*$/, 'Seuls les caractères arabes sont autorisés');
    });

    document.querySelectorAll('.inputs-fr').forEach(inputField => {
        handleInputValidation(inputField, /^[a-zA-Z\s]*$/, "Seuls les caractères latins sont autorisés");
    });

    document.querySelectorAll('.inputs-alphanum').forEach(inputField => {
        handleInputValidation(inputField, /^[a-zA-Z0-9\s]*$/, "Seuls les caractères alphanumériques sont autorisés");
    });

    document.querySelectorAll('.inputs-number').forEach(inputField => {
        handleInputValidation(inputField, /^[0-9]*$/, "Seuls les chiffres sont autorisés");
    });

    document.querySelectorAll('.inputs-email').forEach(inputField => {
        handleInputValidation(inputField, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Adresse e-mail invalide");
    });

    document.querySelectorAll('.inputs-uppercase').forEach(inputField => {
        inputField.addEventListener('input', (event) => {
            event.target.value = event.target.value.toUpperCase();
        });
    });

    document.querySelectorAll('.input-req').forEach(inputField => {
        handleRequiredField(inputField);
    });


    document.querySelectorAll('.input-req').forEach(inputField => {
        const label = inputField.parentElement.querySelector('label');
        if (label && !label.querySelector('.text-danger')) {
            const span = document.createElement('span');
            span.classList.add('text-danger');
            span.innerText = '*';
            label.appendChild(span);
        }
    });

    document.querySelectorAll('input[name="type-demandeur"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            const professionnelFields = document.querySelector('.professionnel-fields');
            if (event.target.value === 'professionnel') {
                professionnelFields.style.display = "inline-flex"
            } else {
                if (professionnelFields) {
                    professionnelFields.style.display = "none"

                }
            }
        });
    });



    /** step 2 */
    // List of conservation fields
    const listeCF = [
        { value: "", text: "" },
        { value: "9", text: "AGADIR" },
        { value: "65", text: "AL HAOUZ" },
        { value: "24", text: "AL HOCEIMA" },
        { value: "84", text: "AZEMMOUR" },
        { value: "55", text: "AZILAL" },
        { value: "72", text: "BEN GUERIR" },
        { value: "10", text: "BENI MELLAL" },
        { value: "25", text: "BENSLIMANE" },
        { value: "40", text: "BERKANE" },
        { value: "53", text: "BERRECHID" },
        { value: "74", text: "Boulmane Missour" },
        { value: "47", text: "CASA AIN CHOCK" },
        { value: "45", text: "Casa Ain Sbaa Hay Mohammadi" },
        { value: "1", text: "CASA ANFA" },
        { value: "73", text: "Casa Elfida Mers Sultan" },
        { value: "64", text: "CASA HAY HASSANI" },
        { value: "71", text: "CASA MAARIF" },
        { value: "63", text: "CASA NOUACER" },
        { value: "49", text: "Casa Sidi Bernoussi" },
        { value: "12", text: "CASA SIDI OTHMANE" },
        { value: "66", text: "CHICHAOUA" },
        { value: "80", text: "CHTOUKA AIT BAHA" },
        { value: "62", text: "DAKHLA" },
        { value: "87", text: "DAR BOUAZZA" },
        { value: "67", text: "EL HAJEB" },
        { value: "8", text: "EL JADIDA" },
        { value: "22", text: "EL KELAA DES SRAGHNA" },
        { value: "14", text: "ERRACHIDIA" },
        { value: "35", text: "ESSAOUIRA" },
        { value: "7", text: "FES" },
        { value: "69", text: "Fes Zouagha" },
        { value: "68", text: "FQUIH BEN SALEH" },
        { value: "56", text: "Guelmim" },
        { value: "79", text: "GUERCIF" },
        { value: "86", text: "HAD SOUALEM" },
        { value: "78", text: "Harhoura-Skhirat" },
        { value: "57", text: "IFRANE" },
        { value: "60", text: "INEZGANE AIT MELLOUL" },
        { value: "54", text: "KARIAT BA MOHAMED" },
        { value: "13", text: "KENITRA" },
        { value: "16", text: "KHEMISSET" },
        { value: "27", text: "KHENIFRA" },
        { value: "18", text: "KHOURIBGA" },
        { value: "17", text: "LAAYOUNE" },
        { value: "36", text: "LARACHE" },
        { value: "83", text: "MARRAKECH GUELIZ" },
        { value: "4", text: "MARRAKECH MENARA" },
        { value: "43", text: "Marrakech Sidi Youssef Ben Ali" },
        { value: "76", text: "M'DIQ FNIDEQ" },
        { value: "85", text: "MEDYOUNA" },
        { value: "59", text: "MEKNES AL ISMAILIA" },
        { value: "5", text: "MEKNES EL MENZEH" },
        { value: "42", text: "MIDELT" },
        { value: "26", text: "MOHAMMADIA" },
        { value: "11", text: "NADOR" },
        { value: "28", text: "OUARZAZATE" },
        { value: "2", text: "OUJDA" },
        { value: "77", text: "OUJDA ANGAD" },
        { value: "3", text: "RABAT" },
        { value: "50", text: "Rabat Ryad" },
        { value: "29", text: "ROMMANI" },
        { value: "23", text: "SAFI" },
        { value: "58", text: "Salé El jadida" },
        { value: "20", text: "Salé Medina" },
        { value: "41", text: "SEFROU" },
        { value: "15", text: "SETTAT" },
        { value: "44", text: "SIDI BENNOUR" },
        { value: "30", text: "SIDI KACEM" },
        { value: "70", text: "SIDI SLIMANE" },
        { value: "75", text: "Sidi Smail Zemamra" },
        { value: "52", text: "SOUK LARBAA" },
        { value: "82", text: "SOUK SEBT OULED NEMMA" },
        { value: "88", text: "TAMESNA" },
        { value: "61", text: "TANGER BENI MAKADA" },
        { value: "6", text: "Tanger Ville" },
        { value: "37", text: "TAOUNATE" },
        { value: "51", text: "TAOURIRT" },
        { value: "39", text: "TAROUDANT" },
        { value: "21", text: "TAZA" },
        { value: "38", text: "TEMARA" },
        { value: "19", text: "TETOUAN" },
        { value: "81", text: "TIFELT" },
        { value: "31", text: "TIZNIT" }
    ];

    // Populate the dropdown with conservation fields
    const selectElement = document.getElementById('DropDownConservation');

    listeCF.forEach(cf => {
        const option = document.createElement('option');
        option.value = cf.value;
        option.textContent = cf.text;
        selectElement.appendChild(option);
    });




    /**
     * Displays a notification message on the screen.
     *
     * @param {string} message - The message to display in the notification.
     * @param {string} [type='info'] - The type of notification. Can be 'info', 'success', 'warning', or 'danger'.
     *
     * The notification will automatically fade out and be removed after 5 seconds.
     * The notification can also be manually closed by clicking the close button.
     */
    const showNotification = (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.innerHTML = `<span>${message}</span><i class="close-btn fa-solid fa-circle-xmark"></i>`;

        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        document.body.appendChild(notification);

        switch (type) {
            case 'info':
                notification.style.backgroundColor = '#1702ff';
                break;
            case 'success':
                notification.style.backgroundColor = '#00b10b';
                break;
            case 'warning':
                notification.style.backgroundColor = '#ff6400';
                break;
            case 'danger':
                notification.style.backgroundColor = '#ff0000';
                break;
            default:
                notification.style.backgroundColor = '#17a2b8';
        }

        // Fade-in from right
        requestAnimationFrame(() => {
            notification.style.right = '20px';
        });

        ////Auto-remove after 5 seconds with fade-out to right
        setTimeout(() => {
            notification.style.transition = 'right 0.5s ease, opacity 0.5s ease';
            notification.style.right = '-300px';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 5000);

        // Remove on close button click with fade-out to right
        notification.querySelector('.close-btn').addEventListener('click', () => {
            notification.style.transition = 'right 0.5s ease, opacity 0.5s ease';
            notification.style.right = '-300px';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        });
    };




    // Show preloader
    /**
     * Displays a preloader with the specified text.
     *
     * @param {string} text - The text to display inside the preloader.
     */
    const showPreloader = (text) => {
        const preloader = document.createElement('div');
        preloader.id = 'preloader';
        const TextPreloader = document.createElement('div');
        preloader.appendChild(TextPreloader);
        TextPreloader.innerText = text;
        TextPreloader.style.color = 'white';
        TextPreloader.style.fontSize = '20px';
        TextPreloader.style.position = 'absolute';
        TextPreloader.style.top = '50%';
        TextPreloader.style.left = '50%';
        TextPreloader.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(preloader);
    };

    // Close preloader
    const closePreloader = () => {
        setTimeout(() => {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.remove();
            }
        }, 2000);

    };



    // ----set-captcha with script
    var captcha = sliderCaptcha({
        id: 'captcha',
        loadingText: 'Chargement...',
        failedText: 'Réessayez',
        barText: 'Glissez vers la droite pour remplir',
        repeatIcon: 'fa fa-redo',
        onSuccess: function () {
            setTimeout(function () {

                document.querySelector('.slidercaptcha').style.boxShadow = 'none';
                document.querySelector('.sliderContainer').style.pointerEvents = 'none';
                document.querySelector('.sliderContainer').style.opacity = '0.5';
                
                captchaConfirmed = true;
                captcha.reset();
            }, 500);
        },
        setSrc: function () {
            //return 'https://picsum.photos/' + Math.round(Math.random() * 136) + '.jpg';
        },
    });


});
