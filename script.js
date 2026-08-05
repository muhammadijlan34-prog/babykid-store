window.addEventListener("load",()=>{

    setTimeout(()=>{

        document.getElementById("splash-screen").style.display="none";

        document.getElementById("main-content").style.display="block";

    },2000);

});
/* Back To Top */

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll",()=>{

    if(window.scrollY>300){

        topBtn.style.display="block";

    }else{

        topBtn.style.display="none";

    }

});

topBtn.onclick=()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

};
// ===============================
// WhatsApp Order
// ===============================

function orderProduct(productName, price){

    const phone = "91XXXXXXXXXX";

    const message = `Hello Baby Kid,

I want to order this product.

Product : ${productName}

Price : ₹${price}

Please share more details.

Thank you.`;

    const url =
`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url,"_blank");

}