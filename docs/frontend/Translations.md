## Translations

Ngx-translate is being used to provide a run time translation engine for internationalization purposes. All translation files are defined in a json format under `libs/client/shared/assets/i18n` and are named `[LANG_CODE].json`. All content in the app (in terms of strings) is pulled from here. There are subdirectories for page specific strings. The json file at the root level of each subdirectory holds shared strings.

### Adding Strings

Simply add strings as key value pairs with as much nesting in the json as needed.

    IMPORTANT NOTE: Make sure there are no overlaps between files in terms of json structure, else there will be conflicts. Try to position the files in a subdirectory in a way that matches the structure of the code files, i.e if strings are needed for a component in a shared library under onboarding client, then the string should be put into the translation file at the root of the onboarding subdirectory. If a string is needed specifically for one page only, it should be placed in the json of that pages subdirectory.

### Configuring Translations in New Modules

Upong adding a new shell module or a feature-module, you will need to add the following code to the `module.ts` imports array:

```ts
    function createTranslateLoader(http: HttpClient) {
	    return new TranslateHttpLoader(http, './assets/i18n/onboarding/signup/', '.json');
    }
    TranslateModule.forChild({
        loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient],
        },
        isolate: false,
        extend: true,
	}),
```

The path provided above should be according to the needs and point to the relevant translation file. Typically, the shared jsons at the root level of each subdirectory is loaded into shell modules whereas in a feature-module, one would import a page specific json if needed (i.e import path could be `./assets/i18n/onboarding/signup/credentials/`). If it is the case where the current module does not even make use of a newly loaded, page specific translation file, then one can exclude much of the configuration above and instead simply use:

```ts
    TranslateModule.forChild({
        isolate: false,
        extend: true,
	}),
```

NOTE: The above code block is also what you would use if you need to use translations in a non lazy loaded module (just a normal imported module such as any under shared ui components).

The code block above depicts the typical structure of using the translate module wherein one defines a loader that will use http calls to retrieve a translation file at run time (for lazy loaded modules such as feature pages and even shells, the files will only be loaded when the module is loaded). The properties `isolate` and `extend` are important as they configure the ability of a module to make use of previously loaded translation files by parent modules. Hence, they must be set to false and true respectively.

Furthermore, one must also add the following to the constructor of every one of these child modules that load a new translation module:

```ts
    constructor(private translationService: TranslationService) {
        const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
    }
```

This forces ngx-translate to make a request for the newly requested translation file for the current module (related to a bug in this github post [Github 1193](https://github.com/ngx-translate/core/issues/1193))

### Adding New Languages

Only one language exists at the moment, i.e, english; however, the process of adding new languages is relatively easy. It would involve making replica json files but titled with a different language code and it will have the same structure; however, the values would be in the other language. One could then programatically set the language using the `TranslationService` API when needed upong listening to language changes (which could be stored in local storage and the ngrx store)