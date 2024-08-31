const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Shirt = require('../models/Shirt');
const Pant = require('../models/Pant');
const PDFDocument = require('pdfkit');
const fs = require('fs');


// Home page route
router.get('/', (req, res) => {
    res.render('index');
});

//view all customer
router.get('/allCustomer', (req, res) => {
    res.redirect('/searchCustomer');
    // res.render('addCustomer');
});

// Add new customer route
router.get('/addCustomer', (req, res) => {
    res.render('addCustomer');
});

router.post('/addCustomer', async (req, res) => {
    const { name, phoneNumber, address, clothingType, deadline } = req.body;

    const customer = new Customer({ name, phoneNumber, address, deadline });

    if (clothingType === 'shirt' || clothingType === 'both') {
        const shirt = new Shirt(req.body.shirtMeasurements);
        await shirt.save();
        customer.measurements.shirt = shirt._id;
    }

    if (clothingType === 'pant' || clothingType === 'both') {
        const pant = new Pant(req.body.pantMeasurements);
        await pant.save();
        customer.measurements.pant = pant._id;
    }

    await customer.save();
    
    res.redirect('/');
});

// // Shirt measurement form route
// router.get('/shirtForm', (req, res) => {
//     res.render('shirtForm');
// });

// // Pant measurement form route
// router.get('/pantForm', (req, res) => {
//     res.render('pantForm');
// });

// Search customer route
router.get('/searchCustomer', async (req, res) => {
    const customers = await Customer.find({ name: new RegExp(req.query.name, 'i') }).populate('measurements.shirt measurements.pant');
    res.render('searchResults', { customers });
});



// router.get('/editCustomer/:id', async (req, res) => {
//     const customer = await Customer.find({ name: new RegExp(req.query.name, 'i') }).populate('measurements.shirt measurements.pant');
//     res.render('editCustomer');
// });

//viewroute
router.get('/viewCustomer/:id', async (req, res) => {
    const { id } = req.params;
    const customer = await Customer.findById(id)
        .populate('measurements.shirt')
        .populate('measurements.pant');

    res.render('viewCustomer', { customer });
});


// Edit Shirt Measurements
router.get('/editShirt/:id', async (req, res) => {
    const { id } = req.params;
    const customer = await Customer.findById(id).populate('measurements.shirt');
    res.render('editShirt', { customer });
});

router.post('/editShirt/:id', async (req, res) => {
    const { id } = req.params;  // Get the customer ID from the route parameters
    const shirtMeasurements = req.body.shirtMeasurements;  // Get the updated shirt measurements from the form




    try {
        // Fetch the customer from the database using the ID
        const customer = await Customer.findById(id).populate('measurements.shirt');

        // Update the shirt measurements in the database
        await Shirt.findByIdAndUpdate(customer.measurements.shirt._id, shirtMeasurements);

        // Redirect back to the customer view page after successful update
        res.redirect(`/viewCustomer/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating shirt measurements");
    }


});


// Edit Pant Measurements
router.get('/editPant/:id', async (req, res) => {
    const { id } = req.params;
    const customer = await Customer.findById(id).populate('measurements.pant');
    res.render('editPant', { customer });
});

router.post('/editPant/:id', async (req, res) => {
    const { id } = req.params;  // Get the customer ID from the route parameters
    const pantMeasurements = req.body.pantMeasurements;  // Get the updated pant measurements from the form

    try {
        // Fetch the customer from the database using the ID
        const customer = await Customer.findById(id).populate('measurements.pant');

        // Update the pant measurements in the database
        await Pant.findByIdAndUpdate(customer.measurements.pant._id, pantMeasurements);

        // Redirect back to the customer view page after successful update
        res.redirect(`/viewCustomer/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating pant measurements");
    }
});

//pdfDownload


router.get('/downloadPDF/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await Customer.findById(id).populate('measurements.shirt measurements.pant');

        // Create a new PDF document
        const doc = new PDFDocument();
        const filePath = `./customer-${customer._id}.pdf`;

        // Set response headers to trigger download
        res.setHeader('Content-disposition', `attachment; filename=${customer.name}-measurements.pdf`);
        res.setHeader('Content-type', 'application/pdf');

        // Pipe the PDF document to the response
        doc.pipe(res);

        // Add content to the PDF
        doc.fontSize(35).text(`SM TAILOR'S`, { align: 'center' });
        doc.fontSize(25).text(`${customer.name}'s Measurements`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(20).text(`Name: ${customer.name}`);
        doc.fontSize(20).text(`Phone: ${customer.phoneNumber}`);
        doc.fontSize(20).text(`Address: ${customer.address}`);
        doc.fontSize(20).text(`Deadline: ${customer.deadline.toDateString()}`);
        doc.moveDown();

        if (customer.measurements.shirt) {
            doc.fontSize(25).text('Shirt Measurements');
            doc.fontSize(18);
            

            const entries = Object.entries(customer.measurements.shirt.toObject());

    // Access each key-value pair by index
    if (entries[4]) {
        doc.text(`${entries[4][0].charAt(0).toUpperCase() + entries[4][0].slice(1)}:${entries[4][1]}`);
    }
    if (entries[3]) {
        doc.text(`${entries[3][1]}`);
    }
    if (entries[2]) {
        doc.text(`${entries[2][1]}`);
    }
   
    
    if (entries[5]) {
        doc.text(`${entries[5][1]}`);
    }
    if (entries[6]) {
        doc.text(`${entries[6][1]}`);
    }
    if (entries[8]) {
        doc.text(`${entries[8][1]}`);
    }
    if (entries[7]) {
        doc.text(`${entries[7][1]}`);
    }
    
    if (entries[10]) {
        doc.text(`${entries[10][1]}`);
    }
    if (entries[9]) {
        doc.text(`${entries[9][1]}`);
    }
   
        doc.moveDown();
    }

        if (customer.measurements.pant) {
            doc.fontSize(25).text('Pant Measurements');
            doc.fontSize(18);
            const entries = Object.entries(customer.measurements.pant.toObject());

    // Access each key-value pair by index
    if (entries[3]) {
        doc.text(`${entries[3][0].charAt(0).toUpperCase() + entries[3][0].slice(1)}:${entries[3][1]}`);
    }
    if (entries[4]) {
        doc.text(`${entries[4][1]}`);
    }
    
    if (entries[2]) {
        doc.text(`${entries[2][1]}`);
    }
   
    if (entries[9]) {
        doc.text(`${entries[9][1]}`);
    }
    if (entries[8]) {
        doc.text(`${entries[8][1]}`);
    }

    if (entries[7]) {
        doc.text(`${entries[7][1]}`);
    }

    
    if (entries[6]) {
        doc.text(`${entries[6][1]}`);
    }
    if (entries[5]) {
        doc.text(`${entries[5][1]}`);
    }
  
        }

        // Finalize the PDF and end the stream
     doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating PDF');
    }
});

//deletecustomer
router.post('/deleteCustomer/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the customer and delete associated measurements
        const customer = await Customer.findById(id);

        if (customer.measurements.shirt) {
            await Shirt.findByIdAndDelete(customer.measurements.shirt._id);
        }

        if (customer.measurements.pant) {
            await Pant.findByIdAndDelete(customer.measurements.pant._id);
        }

        // Delete the customer
        await Customer.findByIdAndDelete(id);

        // Redirect back to the search page after deletion
         res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting customer");
    }
});


module.exports = router;
