function parse(message) {
	if (!message) {
		return []
	}
	if (message.indexOf(" ") < 0) {
		return [message]
	}
	let spl = splitWithTail(message, " ", 1);
	return spl;
}

function splitWithTail(str,delim,count){
	let parts = str.split(delim);
	let tail = parts.slice(count).join(delim);
	let result = parts.slice(0,count);
	result.push(tail);
	return result;
}

module.exports = { splitWithTail, parse };
