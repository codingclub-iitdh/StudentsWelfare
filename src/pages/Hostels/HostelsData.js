import hostel1 from '../../images/homeimage1.jpg';
import hostelimage2 from '../../images/Hostel_2.jpg';
import hostelimage from '../../images/Hostel_3.jpg';
import hostelimage4 from '../../images/Hostel_5.jpg';
import hostelimage5 from '../../images/Hostel_6.jpg';
import hostelimage6 from '../../images/studentcampuslife.jpg';
import hostelroom from '../../images/Hostel_Room (1).jpg';
import hostelroom1 from '../../images/Hostel_Room (2).jpg';

const images = [
    { src: hostelimage6, alt: 'Hostel Image 6' },
    { src: hostel1, alt: 'Hostel Image 1' },
    { src: hostelimage2, alt: 'Hostel Image 2' },
    { src: hostelimage, alt: 'Hostel Image 3' },
    { src: hostelroom, alt: 'Hostel Room Image 1' },
    { src: hostelimage4, alt: 'Hostel Image 4' },
    { src: hostelimage5, alt: 'Hostel Image 5' },
    { src: hostelroom1, alt: 'Hostel Room Image 2' },
];

const wardens = [
    {
        subTitle: 'Boys Hostel-1',
        subSubTitles: [
            {
                subSubtitle: '',
                people: [
                    { name: 'Sudhir K. Sahoo', designation: '' },
                    { name: 'Subhash Mehto', designation: '' },
                ],
            },
        ],
    },
    {
        subTitle: 'Boys Hostel-2',
        subSubTitles: [
            {
                subSubTitle: '',
                people: [
                    { name: 'Saroj Mondal', designation: '' },
                    { name: 'Rakesh Lingam', designation: '' },
                    { name: 'Sushanta K. Sethi', designation: '' },
                ],
            },
        ],
    },
    {
        subTitle: 'Girls Hostel-1',
        subSubTitles: [
            {
                subSubTitle: '',
                people: [
                    { name: 'Ruma Ghosh', designation: '' },
                    { name: 'Shraddha Srivastava', designation: '' },
                ],
            },
        ],
    },
];

export {images, wardens};