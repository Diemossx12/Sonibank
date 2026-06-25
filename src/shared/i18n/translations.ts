export type Language = 'fr' | 'en';

export const translations = {
  fr: {
    welcome_bank_name:    'SONIBANK',
    welcome_bank_sub:     'SOCIETE NIGERIENNE DE BANQUE',
    welcome_slogan:       "L'alliee de votre reussite",
    welcome_glass_title:  'Votre banque, partout avec vous',
    welcome_glass_sub:    'Consultez, virez, gerez vos finances en toute securite depuis votre telephone.',
    welcome_security:     'Chiffrement AES-256 · Certifie BCEAO',
    welcome_btn_login:    'Se connecter',

    login_title:          'Connexion',
    login_subtitle:       'Entrez votre numero de compte SONIBANK pour continuer',
    login_placeholder:    'N de compte (ex: 00001234...)',
    login_hint:           'Votre numero figure sur votre releve ou votre carte bancaire',
    login_btn_continue:   'Continuer',
    login_or:             'ou',
    login_help:           'Contacter mon agence',
    login_security:       'Connexion chiffree AES-256 · Certifie BCEAO',
    login_error_empty:    'Saisissez votre numero de compte',
    login_error_invalid:  'Numero invalide (8 chiffres minimum)',

    otp_title:            'Verification SMS',
    otp_subtitle:         'Un code a 6 chiffres a ete envoye au',
    otp_valid:            'Code valide encore',
    otp_resend:           'Renvoyer le code',
    otp_btn_verify:       'Valider',
    otp_info:             "Si vous ne recevez pas le SMS dans 3 minutes, verifiez que votre numero est bien enregistre aupres de la SONIBANK.",

    pin_login:            'Entrez votre code PIN',
    pin_create:           'Creez votre code PIN a 6 chiffres',
    pin_confirm:          'Confirmez votre code PIN',
    pin_secure:           'Connexion securisee SONIBANK',

    lang_label:           'Langue',
  },

  en: {
    welcome_bank_name:    'SONIBANK',
    welcome_bank_sub:     'NIGERIEN BANKING COMPANY',
    welcome_slogan:       'The ally of your success',
    welcome_glass_title:  'Your bank, everywhere with you',
    welcome_glass_sub:    'Check balances, transfer money, manage your finances securely from your phone.',
    welcome_security:     'AES-256 Encryption · BCEAO Certified',
    welcome_btn_login:    'Sign in',

    login_title:          'Sign in',
    login_subtitle:       'Enter your SONIBANK account number to continue',
    login_placeholder:    'Account number (e.g. 00001234...)',
    login_hint:           'Your account number is on your bank statement or card',
    login_btn_continue:   'Continue',
    login_or:             'or',
    login_help:           'Contact my branch',
    login_security:       'AES-256 Encrypted · BCEAO Certified',
    login_error_empty:    'Please enter your account number',
    login_error_invalid:  'Invalid number (minimum 8 digits)',

    otp_title:            'SMS Verification',
    otp_subtitle:         'A 6-digit code has been sent to',
    otp_valid:            'Code valid for',
    otp_resend:           'Resend code',
    otp_btn_verify:       'Verify',
    otp_info:             "If you don't receive the SMS within 3 minutes, check that your phone number is registered with SONIBANK.",

    pin_login:            'Enter your PIN code',
    pin_create:           'Create your 6-digit PIN',
    pin_confirm:          'Confirm your PIN code',
    pin_secure:           'Secure SONIBANK connection',

    lang_label:           'Language',
  },
} as const;

export type TranslationKey = keyof typeof translations.fr;
