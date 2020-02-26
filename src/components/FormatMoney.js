const formatMoney = (value) => {
   if ((!isNaN(value)) && value > 0.002) {
     let newvalue = parseFloat(value);
     return "$" + newvalue.toLocaleString('en-US');
   } else {
     return value;
   }
}

export default formatMoney
