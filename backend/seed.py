import json
from models import db, Product

SEED_PRODUCTS = [
    dict(name="Yirgacheffe", origin_country="Ethiopia", region="Yirgacheffe", farm="Konga Cooperative",
         roast_level=1, process="washed", altitude_m=1950,
         tasting_notes=["bergamot", "lemon", "jasmine"], price_usd=19.0, weight_g=340,
         stock_count=42, limited=False),
    dict(name="Nyeri AA", origin_country="Kenya", region="Nyeri", farm="Gatomboya Factory",
         roast_level=2, process="washed", altitude_m=1800,
         tasting_notes=["blackcurrant", "tomato", "red wine"], price_usd=21.0, weight_g=340,
         stock_count=30, limited=False),
    dict(name="Tarrazú Honey", origin_country="Costa Rica", region="Tarrazú", farm="La Pastora Estate",
         roast_level=2, process="honey", altitude_m=1700,
         tasting_notes=["honey", "orange peel", "almond"], price_usd=18.0, weight_g=340,
         stock_count=35, limited=False),
    dict(name="Huila Reserva", origin_country="Colombia", region="Huila", farm="Finca El Diviso",
         roast_level=3, process="washed", altitude_m=1650,
         tasting_notes=["caramel", "red apple", "brown sugar"], price_usd=17.0, weight_g=340,
         stock_count=50, limited=False),
    dict(name="Antigua Volcán", origin_country="Guatemala", region="Antigua", farm="San Sebastián",
         roast_level=3, process="washed", altitude_m=1600,
         tasting_notes=["milk chocolate", "clove", "plum"], price_usd=18.0, weight_g=340,
         stock_count=28, limited=False),
    dict(name="Nyamasheke Natural", origin_country="Rwanda", region="Lake Kivu", farm="Nyamasheke Washing Station",
         roast_level=3, process="natural", altitude_m=1750,
         tasting_notes=["strawberry", "cocoa", "black tea"], price_usd=20.0, weight_g=340,
         stock_count=22, limited=False),
    dict(name="Cerrado Block 9", origin_country="Brazil", region="Cerrado Mineiro", farm="Fazenda Sertãozinho",
         roast_level=4, process="natural", altitude_m=1100,
         tasting_notes=["hazelnut", "dark cocoa", "low acidity"], price_usd=15.0, weight_g=340,
         stock_count=60, limited=False),
    dict(name="Mandheling Wet-Hulled", origin_country="Indonesia", region="Sumatra", farm="Lintong Cooperative",
         roast_level=5, process="wet-hulled", altitude_m=1300,
         tasting_notes=["cedar", "dark chocolate", "earth"], price_usd=16.0, weight_g=340,
         stock_count=33, limited=False),
    dict(name="Geisha Lot 7", origin_country="Panama", region="Boquete", farm="Hacienda La Esmeralda",
         roast_level=1, process="washed", altitude_m=1900,
         tasting_notes=["jasmine", "white peach", "honey"], price_usd=34.0, weight_g=227,
         stock_count=8, limited=True),
    dict(name="Mokha Sanani", origin_country="Yemen", region="Haraz Mountains", farm="Smallholder lots",
         roast_level=4, process="natural", altitude_m=2200,
         tasting_notes=["wine", "dried fig", "warm spice"], price_usd=29.0, weight_g=227,
         stock_count=11, limited=True),
]


def seed_if_empty():
    if Product.query.first() is not None:
        return
    for item in SEED_PRODUCTS:
        item = dict(item)
        item["tasting_notes"] = json.dumps(item["tasting_notes"])
        db.session.add(Product(**item))
    db.session.commit()
