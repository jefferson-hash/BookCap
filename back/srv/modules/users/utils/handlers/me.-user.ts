import cds from "@sap/cds";

export default async function userMe(req: any) {
  const { Users, UserRoles } = cds.entities("my.user");

  const userId = req.user?.ID;

  const userMe = await cds.run(SELECT.one.from(Users).where({ ID: userId }));

  // role
  const userRole = await cds.run(
    SELECT.one.from(UserRoles).where({ ID: userMe.role_ID })
  );

  return {
    ID: userMe.ID,
    name: userMe.name,
    email: userMe.email,
    phone: userMe.phone,
    role: userRole.name,
  };
}
