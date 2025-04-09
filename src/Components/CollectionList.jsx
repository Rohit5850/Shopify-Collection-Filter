import React, { useEffect, useState } from 'react'
import img from '../Assets/Images/img.webp'
import { useMemo } from 'react';


const SHOPIFY_STORE_DOMAIN = 'evm-rohit-demo-store.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = 'b2545aa54e6b8e9b964f2c4d4e07e520';




//    Here product list ............................................

const fetchProducts = async () =>{
    const query = `{
         products(first : 250){
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

} ;


//    Here collection list ............................................

const fetchCollections = async () => {

    const query = `
    {
    collections(first :50){
    edges{
    node{
    id
    title
    description
    handle
    image{
    src
    altText
    }
    products(first:200){
    edges{
    node{
    id
    title
    description
    images(first:1){
    edges{
    node{
    src
    altText
    }
    }
    }
    variants(first:1){
    edges{
    node{
    price{
    amount
    currencyCode
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    `

    // console.log("Query :- ", query)
const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json` , {

    method : "POST",
    headers : {
        "Content-Type" : "application/json",
        'X-Shopify-Storefront-Access-Token' : SHOPIFY_ACCESS_TOKEN,
    },
    
    body : JSON.stringify({query})



});

const data = await response.json();
return data.data.collections.edges


} ;



const CollectionList = () => {

    const [products , setProducts] = useState([]);

    const [collection , setCollection] = useState([]);

    const [selectedCollection , setSelectedCollection] = useState("all")

    // console.log("new ------ Products :- ",products )
    // console.log("new --------  Collections :- ",collection )
    useEffect(() => {

    const loadData = async () =>{

        try{

           const productData = await fetchProducts();
           const collectionData = await fetchCollections();

           setProducts(productData.map(p => p.node))
           setCollection(collectionData.map( c => ({
            id : c.node.id,
            title: c.node.title,
            productIds : c.node.products.edges.map(p => p.node.id)
           })))

        //    console.log('Products Data :- ', productData)
        //    console.log('Collection Data :- ',  collectionData)

        }catch(err){
            console.log('Error loading data :- ', err)
        }

    }

    loadData()

    },[])

    const handelFilterChange = (e) =>{

        setSelectedCollection(e.target.value)

    }


    const getFilterProducts = useMemo(() => {
        if (selectedCollection === 'all') return products;

        console.log('Products :- ', products)

        const selected = collection.find(c => c.id === selectedCollection);


        if (!selected) return [];
 
        console.log("--------------------------------------------------", products.includes(selected.productIds))
        

        console.log("Selected :- ", selected)

        return products.filter(product =>{ 
             console.log("Product 22222222222222 :- ", product.id)
             console.log("Selected Product 33333333333333 :- ", selected.productIds)
             console.log("Selected Product 44444444444444 :- ", selected.productIds.includes(product.id))
          return  selected.productIds.includes(product.id) });
    }, [selectedCollection, collection, products]);



    console.log("Filtered products:", getFilterProducts);


  return (
    <div className='collection_container'>

        <div className='collection_cont'>

        <div className='collection-heading'>

            <h2>Shopify Products</h2>

        </div>

        <div className='show_filter'>
            <select onChange={handelFilterChange} >
                <option value="all">All Products</option>
                {
                    collection.map(col => (
                        <option key={col.id} value={col.id}>{col.title}</option>
                    ))
                }
            </select>

        </div>

        <div className='collection_content'>

            {
                getFilterProducts.length > 0 ? (

                    getFilterProducts.map((node) => (
                        <div className='product_box' key={node.id}>

                            {
                                node.images.edges.length > 0 && (
                                    <div className='product_img'>
                                        {  node.images.edges && node.images.edges.length > 0 && node.images.edges[0].node && node.images.edges[0].node.src ?  <img src={node.images.edges[0].node.src} alt={node.images.edges[0].node.altText || 'Product Image'} /> : <img src={img} alt='dummy_img' />  }
                                           
                                        </div>
                                )
                            }

                            <h3>{node.title}</h3>
                            <p>{node.variants.edges[0].node.price.amount} {node.variants.edges[0].node.price.currencyCode}</p>
                            </div>
                    ))
                ) :  ( <div className='loading_data'> <p> Loading Products ....</p> </div>)
            }
       
       </div>


       </div>
    </div>
  )
}

export default CollectionList