# text-typer
A library for text typing like animation.

Make sure to pass only html elements that contain text or you might get unexpected result. 

`TextTyper(element: HTMLElement, typingSpeedInMS: number)` object contains handful of methods.

1. `write()`
2. `delete()`
3. `replace()`
4. `abort()`

### Write

Write method takes 2 parameters:

- `text: string` Text that will be animated in.
- `writeMode: TextTyper.writeMode` How will the text be rendered in the element.
- returns: Promise

##### Write modes

There are total of 4 modes in which the text will be inserted to the element.

- `APPEND` Text is inserted to the end of the element's content. (Default)
- `PREPAND` Text is inserted to the start of the element's content.
- `REPLACE` Replaces whole text in the element with `text` argument.
- `AT(index: number)` Text is inserted at given index in element's content.

### Delete

Delete method takes 4 parameters:

- `text: string` Text that will be deleted. Leave `undefined` to delete whole content.
- `position: number` Determines element that should be deleted if there are multiple texts in content. Zero based system. To access items from end of the selection use negative values: `-1` for last, `-2` for 2nd from end and so on.
- `count: number` Determines how many more should be deleted from given position. If there are N resuls and we want to delete 2nd and 3rd from end then the `position` should be set to `-3` and `count` to `2`
- `replacement: string` Replaces the deleted elements with given value. (Used for `replace` method)
- returns: Promise

### Replace

Replace method takes 4 parameters:

- `text: string` Text that will be replaced.
- `replacement: string`
- `position: number` Works same as `delete:position`
- `count: number` Works same as `delete:count`
- returns: Promise

### Abort

Aborts currently executing animation, returning promise that is fullfilled when the abortion is completed.
