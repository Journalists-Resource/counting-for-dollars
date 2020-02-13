const formatMoney = (value) => {
   value = parseFloat(value);
   return "$" + value.toLocaleString('en-US');
}

export default formatMoney
