import InfoBox from "./infoBox";

const InfoBoxes = () => {
  return (
    <section>
    <div className="container-xl lg:container m-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg">
        <InfoBox 
          buttonInfo={{
            text: "Buy",
            link: "/properties",
          }}
        >
          Find your ideal rental property among our diverse range of listings tailored to your needs.
        </InfoBox>
        <InfoBox 
          buttonInfo={{
            text: "Sell",
            link: "/properties/add",
          }}
        >
          Showcase your property with high-quality images and detailed descriptions to attract interested buyers.
        </InfoBox>
        <InfoBox
          buttonInfo={{
            text: "Rent",
            link: "/properties",
          }}
        >
          Explore rental options ranging from budget-friendly apartments to luxurious penthouses.
        </InfoBox>
      </div>
    </div>
  </section>
  )
}

export default InfoBoxes;