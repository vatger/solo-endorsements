interface User {
  apidata: {
    cid: number;
    personal: {
      name_first: string;
      name_last: string;
      name_full: string;
    };
  };

  vatsim: {
    rating: LongVatsimDetails;
    pilotrating: LongVatsimDetails;
    division: ShortVatsimDetails;
    region: ShortVatsimDetails;
    subdivision: ShortVatsimDetails;
  };

  access_token?: string;
  refresh_token?: string;

  soloManager: {
    isAdmin: boolean;
    isMentor: boolean;
  }
}

export interface LongVatsimDetails {
  id: number;
  long: string;
  short: string;
}

export interface ShortVatsimDetails {
  id: number;
  name: string;
}

export default User;

