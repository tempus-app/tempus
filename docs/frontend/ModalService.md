## Modal Service

A reusable modal service has been created for both information and content modals

### Getting Started

To use modals, first import the ModalService into the appropriate component

### Creation -  Info Modals

These modals are less complex, and should be served only to display a specific message on the screen

The following code can be used to open a new information modal

```
this.modalService.open(
			{ title: 'Title',closeText: 'Cancel', confirmText: 'Confirm', message: errorMessage, modalType: ModalType.ERROR },
			CustomModalType.INFO,
);
```
- Required parameters: title, confirmText, message, modalType, closable
- Optional parameters: closeText (if asking simple decision this might be useful)


### Creation -  Content Modals
Content modals are more complex as they require a template to be injected into the modal, therefore in the component that is using the modal trigger must define a template as follows. 

```
<ng-template #templateId>
  <p>Some Data</p>
</ng-template>

```

Then, within the component do the following to get access to the template:

```
	@ViewChild('templateId')
	template: TemplateRef<unknown>;

```
and open the modal with the template 

```	
this.modalService.open(
			{ title: 'Error Using Link', closeText: 'Cancel', confirmText: 'Invite', template: this.template },
			CustomModalType.CONTENT,
		);

```
- Required parameters: title, confirmText,closable, closeText, message, modalType
### Events + Subscription 

In many cases, it is useful to watch for a modalClose and a modalConfirm events

#### On Confirm Selected
 This method in the dialog simply triggers the subject `confirmEventSubject`. This means the component creating the modal has full control over what happens. To subscribe to the confirmEventSubject, add the following code: 

```
this.modalService.confirmEventSubject.subscribe(() => {
		// do something if confirmed is true
});
```

the confirmedEventSubject is especially useful in content modals as we can trigger validations etc.
for modals that are acknowledgements, it can be used to close the modal as well

#### On Close Selected

This method closes the current modal, if there is closeText passed. To trigger an event after a modal is closed, we can subscribe to the closed event

```
this.modalService.closed().subscribe(() => {
		// do something after modal closes
        this.modalService.confirmEventSubject.unsubscribe();
});

```