module.exports = (data, temp) => {
  let output = temp.replace(/{%TODO_TITLE%}/g, data.title);
  if (data.completed) {
    output = output.replace(/{%IS_COMPLETE%}/g, 'done');
    output = output.replace(/{%IS_COMPLETE_IMG%}/g, '✅');
  } else {
    output = output.replace(/{%IS_COMPLETE%}/g, '');
    output = output.replace(/{%IS_COMPLETE_IMG%}/g, '❌');
  }
  return output;
};
