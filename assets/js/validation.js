document.addEventListener('DOMContentLoaded', () => {

    const validateInputsFormat = () => {

        const emailInput = document.querySelector('.inputs-email');
        if (emailInput && emailInput.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            showWarningInputs(emailInput, "Adresse e-mail invalide");
            emailInput.focus();
            allValid = false;
        }


        const frInputs = document.querySelectorAll('.inputs-fr');
        frInputs.forEach(frInput => {
            if (frInput.value.trim() && !/^[a-zA-Z\s]*$/.test(frInput.value)) {
                showWarningInputs(frInput, "Seuls les caractères latins sont autorisés");
                frInput.focus();
                allValid = false;
            }
        });

        document.querySelectorAll('.inputs-ar').forEach(arInput => {
            if (arInput.value.trim() && !/^[\u0600-\u06FF\s]*$/.test(arInput.value)) {
                showWarningInputs(arInput, "Seuls les caractères arabes sont autorisés");
                arInput.focus();
                allValid = false;
            }
        });

        document.querySelectorAll('.inputs-number').forEach(numberInput => {
            if (numberInput.value.trim() && !/^[0-9]*$/.test(numberInput.value)) {
                showWarningInputs(numberInput, "Seuls les chiffres sont autorisés");
                numberInput.focus();
                allValid = false;
            }
        });

        document.querySelectorAll('.inputs-alphanum').forEach(alphanumInput => {
            if (alphanumInput.value.trim() && !/^[a-zA-Z0-9\s]*$/.test(alphanumInput.value)) {
                showWarningInputs(alphanumInput, "Seuls les caractères alphanumériques sont autorisés");
                alphanumInput.focus();
                allValid = false;
            }
        });


        if (!allValid) {
            showNotification('Veuillez vérifier le format saisi', 'danger');
            return;
        }

    }

    const validateInputsFill = (inputsFieldsSet) => {
        inputsFieldsSet.forEach(inputField => {
            const isProfessionnelField = inputField.closest('.professionnel-fields');
            const isParticulierChecked = document.querySelector('input[name="type-demandeur"]:checked').value === 'particulier';

            if (isParticulierChecked && isProfessionnelField) {
                return; // Skip validation for professionnel fields if particulier is checked
            }

            if (!inputField.value.trim()) {
                showAlertInputs(inputField, 'Champ requis');
                showNotification('Veuillez remplir tous les champs requis', 'danger');
                inputField.focus();
                allValid = false;
                return;
            } else {
                hideAlertInputs(inputField);
            }
        });
    }

    const validatePolicy = () => {

        // alert(allValid)
        const legalMentionsCheckbox = document.getElementById('legal-mentions');
        if (legalMentionsCheckbox && !legalMentionsCheckbox.checked) {
            showNotification("Vous devez accepter les mentions légales", 'warning');
            legalMentionsCheckbox.style.borderColor = 'red';
            allValid = false;
            return;
        }
        else
            legalMentionsCheckbox.style.borderColor = '#dee2e6';
    }

    const validateCaptcha = () => {

        const userInput = document.getElementById("captchaInput");  // Get user's input 
        if (!verifyCaptcha(userInput))  // Get user's input 
        {
            showNotification("Code captcha saisi incorrect !!", 'warning');
            userInput.style.borderColor = 'red';

            allValid = false;
            return;
        } else {
            userInput.style.borderColor = '#dee2e6';
        }

    }

    /**
     * Captcha config
     */
    const generateRandomAlphanum = (length = 4) => {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const generateCaptchaImage = () => {
        const captchaText = generateRandomAlphanum();
        const canvas = document.createElement("canvas");
        canvas.width = 130;
        canvas.height = 50;
        const ctx = canvas.getContext("2d");

        // Draw background
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = "40px Arial";
        ctx.fillStyle = "#000";
        ctx.textBaseline = "middle";

        // Render each character with slight rotation
        let x = 10;
        for (let i = 0; i < captchaText.length; i++) {
            const char = captchaText.charAt(i);
            const angle = (Math.random() - 0.5) * 0.4; // Random rotation between -0.2 and 0.2 radians
            ctx.save();
            ctx.translate(x, canvas.height / 2);
            ctx.rotate(angle);
            ctx.fillText(char, 0, 0);
            ctx.restore();
            x += 20;
        }

        // Add interference lines
        for (let i = 0; i < 20; i++) {
            ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random()})`;
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }

        return { captchaText, dataUrl: canvas.toDataURL() };
    };

    const initCaptcha = () => {
        const captchaContainer = document.getElementById('captcha');

        const { captchaText, dataUrl } = generateCaptchaImage();
        captchaContainer.innerHTML = "";
        const img = document.createElement("img");
        img.classList.add('me-2')
        img.src = dataUrl;
        captchaContainer.appendChild(img);

        // Save the new CAPTCHA text globally
        window.generatedCaptchaText = captchaText;

        // Create and append the refresh icon instead of a button
        const refreshIcon = document.createElement("i");
        refreshIcon.classList.add("fa", "fa-refresh");
        refreshIcon.style.cursor = "pointer";
        refreshIcon.style.marginLeft = "10px";

        // Pass the captchaContainer to initCaptcha when the icon is clicked
        refreshIcon.addEventListener("click", () => initCaptcha());
        captchaContainer.appendChild(refreshIcon);
    };


    /**
     * Keyboard arabic config
     */
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

    const phoneInput = document.getElementById('num-phone');
    var phoneInputValid = false;

    // Function to validate and format the phone number
    const validateAndFormatPhoneNumber = (value) => {
        const formatter = new libphonenumber.AsYouType();
        const formattedNumber = formatter.input(value);
        const parsedNumber = formatter.getNumber();

        return {
            isValid: parsedNumber ? parsedNumber.isValid() : false,
            formattedNumber,
        };
    };

    // Function to update validation state
    const updateValidationState = (isValid) => {
        if (!isValid) {

            showAlertInputs(phoneInput, 'Numéro invalide');
            phoneInputValid = false;
        }
        else {
            hideAlertInputs(phoneInput);
            phoneInputValid = true;
        }
    };

    // Initialize the input with the detected country code
    const initializePhoneInput = async () => {
        const countryCode = '+212';
        phoneInput.value = countryCode;

        // Validate and format on typing (input event)
        phoneInput.addEventListener('input', (event) => {
            const value = event.target.value;

            // Ensure the input starts with '+'
            if (!value.startsWith('+')) {
                event.target.value = countryCode + value.replace(/\D+/g, '');
                return;
            }

            const { isValid, formattedNumber } = validateAndFormatPhoneNumber(value);
            event.target.value = formattedNumber;
            updateValidationState(isValid);
        });

        // Re-validate on leaving the input (blur event)
        phoneInput.addEventListener('blur', (event) => {
            const value = event.target.value;
            const { isValid } = validateAndFormatPhoneNumber(value);
            updateValidationState(isValid);
        });

        // Prevent deleting the '+' symbol
        phoneInput.addEventListener('keydown', (event) => {
            const selectionStart = event.target.selectionStart;
            if (selectionStart <= 1 && event.key === 'Backspace') {
                event.preventDefault();
            }
        });
    };

    // Start the process
    initializePhoneInput();

    let allValid;
    document.querySelectorAll('.btn-steps').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            let inputsFieldsSet;
            allValid = true;

            switch (button.id) {
                case "next2":
                    inputsFieldsSet = document.querySelectorAll('#step1 input.input-req');
                    if (allValid) validateInputsFill(inputsFieldsSet);
                    if (allValid) validateInputsFormat();
                    if (allValid) {
                        validatePolicy();
                        validateCaptcha();
                    }
                    break;
                case "confirmCommande":
                    inputsFieldsSet = document.querySelectorAll('#step3 input.input-req');
                    if (allValid) validateInputsFill(inputsFieldsSet);
                    if (allValid) validateInputsFormat();
                    alert('Redirection vers CMI pour le paiement ')
                    break;
            }

            if (allValid) {
                if (button.id === 'next2') {

                    fadeOut(document.getElementById('step1'), () => {
                        document.getElementById('step1').classList.add('d-none');
                        document.getElementById('step2').classList.remove('d-none');
                        fadeIn(document.getElementById('step2'));
                        window.scrollTo({ top: 225, behavior: 'smooth' });

                        document.querySelector('#st1').classList.remove('active');
                        document.querySelector('#st2').classList.add('active');
                        document.querySelector('#st1').classList.add('passed');
                    });
                }
                else if (button.id === 'next3') {
                    if (document.getElementById('titreFoncierTableBody').querySelectorAll('tr').length > 0) {
                        fadeOut(document.getElementById('step2'), () => {
                            document.getElementById('step2').classList.add('d-none');
                            document.getElementById('step3').classList.remove('d-none');
                            fadeIn(document.getElementById('step3'));
                            window.scrollTo({ top: 225, behavior: 'smooth' });

                            document.querySelector('#st2').classList.remove('active');
                            document.querySelector('#st3').classList.add('active');
                            document.querySelector('#st2').classList.add('passed');

                        });
                    } else {
                        showNotification('Veuillez ajouter au moins un titre foncier', 'danger');
                    }
                } else if (button.id == 'confirmCommande') {

                }
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
                showNotification('Veuillez remplir tous les champs requis', 'danger');
                allValid = false;
                return;
            } else if (validateInputsFormat()) {
                showNotification('Veuillez vérifier le format saisi', 'danger');
                allValid = false;
                return;
            }
            else {
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

        let tableConfirmed = document.getElementById('titreFoncierTableConfirmed');

        accessCount++;
        showPreloader('Vérification du titre foncier...');
        if (accessCount === 1) {
            // First time access condition

            setTimeout(() => {
                showNotification('Erreur lors de la vérification du titre foncier !!', 'danger');
            }, 500);
        } else if (accessCount === 2) {
            // Second time access condition
            setTimeout(() => {
                showNotification(`Titre foncier "${newRowContent}" non disponible  !!`, 'warning');
            }, 500);
        } else if (accessCount >= 3) {

            setTimeout(() => {
                showNotification(`Titre foncier "${newRowContent}" disponible`, 'success');
            }, 500);

            // Proceed with adding the new row
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
            <td class="text-center"><i class="fa-solid fa-circle-check text-success "></i></td>
            <td>${newRowContent}</td>
            <td>${conservation.options[conservation.selectedIndex].text}</td> 
            <td><i class="fa-duotone fa-solid fa-trash remove-titre text-danger"></i></td>
            `;

            tableBody.appendChild(newRow);

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
                // Remove corresponding row from tableConfirmed
                if (tableConfirmed) {
                    tableConfirmed.innerHTML = tableBody.innerHTML;
                    tableConfirmed.querySelectorAll('tr').forEach(row => {
                        if (row.cells[3]) {
                            row.cells[3].innerText = '100';
                        }
                    });
                    // Compute the total of the 4th cell values from the body rows
                    let total = 0;
                    tableConfirmed.querySelectorAll('tr').forEach(row => {
                        if (row.cells[3]) {
                            total += parseFloat(row.cells[3].innerText) || 0;
                        }
                    });
                    // Create or update the tfoot with the total in the 4th cell
                    let tfoot = tableConfirmed.nextElementSibling;
                    tfoot.querySelector('tr').cells[2].innerText = total + ' DH (TTC)';
                }
            });

            // Remove corresponding row from tableConfirmed
            if (tableConfirmed) {
                tableConfirmed.innerHTML = tableBody.innerHTML;
                tableConfirmed.querySelectorAll('tr').forEach(row => {
                    if (row.cells[3]) {
                        row.cells[3].innerText = '100';
                    }
                });
                // Compute the total of the 4th cell values from the body rows
                let total = 0;
                tableConfirmed.querySelectorAll('tr').forEach(row => {
                    if (row.cells[3]) {
                        total += parseFloat(row.cells[3].innerText) || 0;
                    }
                });
                // Create or update the tfoot with the total in the 4th cell
                let tfoot = tableConfirmed.nextElementSibling;
                tfoot.querySelector('tr').cells[2].innerText = total + ' DH (TTC)';
            }

            document.querySelectorAll('.list-titre-added table').forEach(element => {
                element.style.display = 'table';
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
                        document.querySelector('#st2').classList.remove('passed');

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

            inputField.style.borderColor = '#01cd01';

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
        TextPreloader.style.textAlign = 'center';
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
        }, 500);

    };

    // Initial generation of the CAPTCHA with refresh icon
    initCaptcha();

    // Function to verify user input against the CAPTCHA
    function verifyCaptcha(userInput) {
        if (userInput.value === window.generatedCaptchaText) {
            return true;
        }
        initCaptcha();
        return false;
    }


    // send SMS 
    const sendSMS = document.getElementById('btn-sendCode');
    const numPhone = document.getElementById('num-phone');
    const codePhone = document.getElementById('code-phone');

    sendSMS.addEventListener("click", (event) => {
        event.preventDefault()

        if (phoneInputValid) {
            codePhone.parentElement.classList.remove('d-none')
            numPhone.parentElement.classList.add('d-none')
            codePhone.focus()
        }
        else {
            numPhone.focus()
            showNotification('Veuillez saisir un numéro valide !!', 'danger')
        }
    });


    codePhone.addEventListener("input", (event) => {
        // Get the current value of the input field
        let value = event.target.value;
        const iconLoad = document.querySelector('.loading-icon');
        const confirmCommande = document.querySelector('#confirmCommande');
        
        // Remove any non-digit characters (only keep digits)
        value = value.replace(/\D/g, "");

        // Limit the input to 4 digits
        if (value.length > 4) {
            value = value.substring(0, 4); // Restrict to 4 digits
            value = ''
        }

        // Add dashes after every digit except the 4th one
        let formattedValue = "";
        for (let i = 0; i < value.length; i++) {
            formattedValue += value[i];
            // Add a dash after every digit except the 4th one
            if (i !== 3 && i !== value.length - 1) {
                formattedValue += " - ";
            }
        }

        // Update the input field with the formatted value
        event.target.value = formattedValue;

        // Check if the value length is exactly 4 digits
        iconLoad.lastElementChild.classList.add('d-none');
        if (value.length === 4) {

            // Toggle visibility of icons on the 4th digit input
            iconLoad.firstElementChild.classList.toggle('d-none');
            setTimeout(() => {
                iconLoad.firstElementChild.classList.toggle('d-none');
                iconLoad.lastElementChild.classList.toggle('d-none');
                confirmCommande.style.cursor = 'pointer'
                confirmCommande.style.opacity = 1
                confirmCommande.style.disabled = "false"
            }, 500); // Hide the icon after 2 seconds
            return;
        }
    });
 

});
