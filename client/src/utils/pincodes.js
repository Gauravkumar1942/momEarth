export const pincodesBySellers = {
    "papayapads" : [110030, 201301, 802219, 821307],
    "cococusto" : [110095, 110090, 802219, 821307, 821308]
}

export function getPincodesBySeller(sellerName){
    return pincodesBySellers[String(sellerName)];
}