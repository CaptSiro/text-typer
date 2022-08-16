const write = new TextTyper($(".write"));
const prepand = new TextTyper($(".prepand"));
const append = new TextTyper($(".append"));
const at = new TextTyper($(".at"));
const replaceWhole = new TextTyper($(".replace-whole"));
const replaceAll = new TextTyper($(".replace-all"));
const replaceOne = new TextTyper($(".replace-one"));
const replaceRange = new TextTyper($(".replace-range"));
const deleteWhole = new TextTyper($(".delete-whole"));
const deleteAll = new TextTyper($(".delete-all"));
const deleteOne = new TextTyper($(".delete-one"));
const deleteRange = new TextTyper($(".delete-range"));

async function animate () {
  await write.write("Hello!");
  await prepand.write("I've been working ", TextTyper.writeMode.PREPEND);
  await append.write(" the biggest headache.");
  await at.write(", this demo is without", TextTyper.writeMode.AT(7));
  await replaceOne.replace("n't working very well", " working fine");
  await replaceRange.replace("_space_", " ", 1, 2);
  await replaceAll.replace("3", "e", 0, Infinity);
  await replaceWhole.write("Putting around 8 to 9 hours every day.", TextTyper.writeMode.REPLACE);
  await deleteOne.delete(" for later");
  await deleteRange.delete("u", -2, 2);
  await deleteAll.delete(",", 0, Infinity);
  await deleteWhole.delete();
}

setTimeout(async () => {
  await animate();
}, 200);