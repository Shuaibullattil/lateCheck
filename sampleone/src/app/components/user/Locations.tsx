import React from 'react';

const hostelMaps = [
    {
      name: "sahara",
      iframe: `<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3928.635276812947!2d76.333542!3d10.046925!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d003f94efb7%3A0xddef6e0d50d412aa!2sSahara%20Hostel!5e0!3m2!1sen!2sin!4v1745005320322!5m2!1sen!2sin" width="100%" height="200" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    },
    {
      name: "sagar",
      iframe: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.646783202619!2d76.32849227484647!3d10.045977790061775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d00264c120f%3A0x8517be38180b680c!2sSagar%20hostel!5e0!3m2!1sen!2sin!4v1745005444838!5m2!1sen!2sin" width="100%" height="200" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    },
    {
      name: "sarovar",
      iframe: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.643129301128!2d76.32795217484636!3d10.046278590061506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d002b583e67%3A0x32db45ea2d6f5379!2sSarovar%20Men&#39;s%20Hostel!5e0!3m2!1sen!2sin!4v1745005571888!5m2!1sen!2sin" width="100%" height="200" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    },
    {
      name: "swaraj",
      iframe: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1032.6761531773689!2d76.33003215645677!3d10.046068329852716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d0000bdc341%3A0xb0d1a4f4af5e8232!2sSwaraj%20Boys%20Hostel!5e0!3m2!1sen!2sin!4v1745005816299!5m2!1sen!2sin" width="100%" height="200" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    },
  ];
  

  const Location = ({ hostelName }: { hostelName: string }) => {
    // Find the map iframe based on the hostel name
    const hostel = hostelMaps.find((hostel) => hostel.name === hostelName);
  
    if (!hostel) {
      return <p>Map not available for this hostel.</p>;
    }
  
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: hostel.iframe,
        }}
      />
    );
  };
  
  export default Location;
  