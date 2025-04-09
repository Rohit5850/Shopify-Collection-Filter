import React, { useEffect, useState } from 'react'

const SHOPIFY_STORE_DOMAIN = 'evm-rohit-demo-store.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = 'b2545aa54e6b8e9b964f2c4d4e07e520';

const fetchProducts = async () =>{
    const query = `{
         products(first : 200){
         edges {
         node {
         id
         title
         description
         variants(first : 1){
         edges{
         node{
         price {
         amount
         currencyCode
         }
         }
         }
         }
         images(first :1){
         edges {
         node {
         src 
         altText
         }
         }
         }
         }
         }
         }
    }`

    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json` , {
        method : 'POST',
        headers:{
            "Content-Type" : 'application/json',
            'X-Shopify-Storefront-Access-Token' : SHOPIFY_ACCESS_TOKEN,
        },
        body : JSON.stringify({query})
    });

    const data = await response.json();
   
    return data.data.products.edges

}




const ProductList = () => {

const [product , setProducts] = useState([]);

useEffect(() => {

   
    const getProducts = async () =>{

        try{
         const data = await fetchProducts();
         setProducts(data)

         console.log("My data :- " ,data)
        }catch(error){
          console.log('Error fetching products :', error)
        }


    }
    
    getProducts()

}, [])
 
console.log("Products :- ", product )

  return (
    <div className='shopify_products'>

        <div className='shopify_heading'> <h2>Shopify Products</h2></div>

        <div className='all_products'>

           {
           product.length > 0 ? (product.map(({node}) => (

            <div className='product_box'>

               {node.images.edges.length > 0 &&  ( <div className='product_img'> <img src={node.images.edges[0].node.src}  alt={node.images.edges[0].node.altText || 'Product Image'} width="100%"/> </div>)} 
                
               <h3>{node.title}</h3>
               <p>{node.variants.edges[0].node.price.amount} {node.variants.edges[0].node.price.currencyCode}</p>
               {/* <p>{node.description}</p> */}
            </div>





           ))) : (<p> Loading Products ......</p>)
           }
           

         
        </div>
        
    </div>
  )
}

export default ProductList