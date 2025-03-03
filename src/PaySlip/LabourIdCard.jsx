import React from "react";
import { Card, CardContent, Typography, Avatar, Grid, Box } from "@mui/material";
import vjLogo from "../images/VJlogo-1-removebg.png";
import { Table, TableBody, TableRow, TableCell } from "@mui/material";


const LabourIdCard = ({
    name = "Kamlesh Kumar",
    id = "JC0020",
    project = "VJ SuperNova",
    emergencyNumber = "7080112207",
    dob = "19-08-1997",
    joiningDate = "24-07-2022",
    department = "Plumbing",
    designation = "Helper - Plumbing",
    inductionDate = "24-07-2022",
    inductionBy = "Mahesh Madhukar Kate",
    aadhaar = "3571 7815 4067",
    validUpto = "24-07-2023",
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                minHeight: "100vh",
                backgroundColor: "#f5f5f5",
                padding: 2,
                marginTop: 0
            }}
        >
            <Grid
                container
                spacing={2}
                sx={{ maxWidth: 800, display: "flex", alignItems: "stretch" }} // Ensures equal height
            >
                {/* Front Side */}
                <Grid item xs={6} sx={{ display: "flex" }}>
                    <Card
                        sx={{
                            border: "2px solid #001F54",
                            borderRadius: 2,
                            textAlign: "center",
                            padding: 2,
                            width: "100%",
                            maxWidth: "330px",
                            alignItems: 'center',
                            display: "flex",
                            flexDirection: "column",
                            minHeight: "100%", // Ensures equal height
                        }}
                    >
                        <img
                            src={vjLogo}
                            alt="Company Logo"
                            style={{ width: "130%", maxWidth: "190px", margin: "20px" }}
                        />
                        <Typography
                            variant="subtitle1"
                            color="primary"
                            sx={{ fontWeight: "bold" }}
                        >
                            We ❤️ What We Do!
                        </Typography>
                        <Avatar
                            src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEBUQEBIWFhAVEBUXFRUQFRUVEBYVFRUWFxUVFRUYHSggGBomHRUVITEhJSkrLi4uFx8zODMtNygtLi0BCgoKDg0OGxAQGy0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAAAQIDBAUGBwj/xABFEAABBAAEAwYEAgcFBQkAAAABAAIDEQQSITEFQVEGEyJhcYEykaGxFMEHI0JSYoLwcpLR4fEVM2OywhY0NUNEVHN0ov/EABoBAAMBAQEBAAAAAAAAAAAAAAECAwAEBQb/xAAqEQACAgICAQMCBgMAAAAAAAAAAQIRAyESMUEEMlETIgUUYXGh0RVCgf/aAAwDAQACEQMRAD8A8ljCtRrMZi65KdmPHQrkljkdsZxNNqZONlVbxFvQqaPENf8ADyUeEltoqpRfTDKlDVKGpQ1LyNRGGpQ1ShqXKhYaIwxKGKUNTgEOQ1EYanBqflTg1LyNQwNTg1PDU4NSthojyoxHCXyVloHq5wDSOe+xC3MBwwUZJKygWMx36aDULRikeRfcgAaNcA5o6Xq/xewV8UH7mRnO9I45/ZyUEE5dd6yvBH7zd79NFuHszCYw0PIcDvRAPWmE6egcf8N1kDi6+emrT4ud6/TbkoMVhwTlc2uWdrgG3uDoKJ25rptdEXFnI43gxhPjtzHVTm6M66mtHaXX1WdicE5ur93XVa7Ej5aH5LoJ8U8NcxwsaaHUGuh99Faw7oZRQLWuGgJbQvTXUnkBoKCavgRo46aOio8i1uLYAxuOtjrd/P8A1WclsxEY0Mj1U4CfkWsxG2IJTEpmtSkLBKcUVzV/CtvCQALMwTf1zvJoWxGaXPnk7otjX2ljIEKPvULntj0clIEjh5Jz09wXqI4mRMaFewDRZpVAFewA1KTL7B8PvLYCcAnAJwC4GzvoaAlATgE4NQsKQ2k4NSgJ1JbNQgalATkoS2EbSs4PDF5obDckgNA6knQBQhTxgBuZzQ6zlAOg62dD5J8UeU0hMkuMbOz4VgQ5gygucKOexr6E7AdTpppoFNNbpQ0NblvSgSfKzdEe1+qyeGYrETXTiGtAFA0xx01rbTfoK269jwPAhrMzvE41qbJ09dV3ZZKKpHPhg27M6HgxomiDfw2K8r3HU/JQ4nhYzbEuDdSRe/IDT5+q7CNopVsZhg4b68q3Cki8kef4zh7W60NtQNwSdSOvNcpxvhoZUkNjm4f4L1dnARmsHcb/ALXz+az+LdmwWOy760D6Vutz4uwcOSo89kcJYA/NbhobrU+ixZIdfJdPNwx+Fa7wDKTqQL18/JY2Kj15X/RGtUVe1JWjlcXF0ykIug1SCJ3RSEHy+aZ338X1S7AStYhzE+EnmleiYqcPb+sefRaVqjwwW6Q/xK8QuXL7zph7RtpUlISUE5x6e5MdunuK9I4GIAr3D+aohX+Hc1PP7CuD3l0BOASBPC89noCpwSBKEpgCcEiUIGFAUeIxLWDX5DdLPKGMLjy+6wg4uJc7UlXwYOe30RzZeGl2aUfF2XRBA6nUe9LoccKawBoosbW9HMLse9jquIkjrfT6r0ZvDiQGBwLWNA8IIIIFVex2H9aLrWKMHaOf6kp6Zo8CI/3bTbeZ6uHIfT2XbYZ4ApcjwGHLdG3daoCxsAuhheRv/XlS5Msrkd2KFRNeJ3JPYNdd1nYfE3/VH5LRZrujB6NNUD3dFXnpSyR6qni7rT6pZhgkZ3EYGPBBFgggjqCF432kPdyOiFghxBPI6nbovY52mtdD9FxOO4bG7FyPc0H4d6r4Qjhycexc2Lk9Hm4Sei9WxjGCEkNbeXQUOnJeXSgZj6n7ruxZOfg4c2Lh5HYfGOZpuOh/Jaff2LHRY5VzCOtpHRNOK7JRZe4MLa4/xq64KtwVv6r1cVccF5+T3s7o+1ESRPyoQCcu7dSPUbt04leieewCuYOUNaSdrVNRyP5e6E48lQ+JtO0a0fEmk0QR67KyZxVg36LnSVe4e22u8qUMmGKVo6oZZPTNNuKHMKeOUOGixPxB5V7rT4e+22d75KOTHSspGTbLdp4UabO22EdQVz1soZnFMYHkMbsDqeRKqByiYK0TgvWxxUY0jzJzcpWzqeyGEzOdORZjdGyKxY76QkggHQlrWki+ZBXbkyPcDKKmALS+vE6PNfLcja/4lj/ouwpdh5JP3MS4t6Z+5YLrqA4/NdEySZxc6TwxxsPdhzfEc27y7mNNvLzXLOT+qejigvoE+Bw2S73zV5adPqpcXiCzxE0NQenl7owT82oNguO/1I8rtaruGsljyyC7+nuoSX3MrF/ajLi4pTbazOfWvqq8nbIxaSQGr3jsrJ4r2VMbw78RK2MH4XE92fLMw233XNce4dIMTmilLYSBTGyF5ugKIJrcE35qkarsWSfhHpOG7VRSC2kjydofdTP4o26sXS4ns9wqSZ4adBQs1Q9FW7QulZizhGlxkoZQz4nXZGWzpzU9yZVUkdvLi2u3c2+QsWvOO1OBdIXSG7cf1Y1ymvCQehsLMwmIikkyOdKJM2W5KAsbiwfJb+CifI5+aduUPytilzknKBZAboNb1TqDgyLkpkvBOzpYwPnDbIHh3CyeJdnxJirDA2DLZLTVnougwkrg0sefhJ5kiuVWoMVixVNOv5pebTtBcItUcp2qwEUXdhjcshHiaD4ctb+trLwQprnFaXafCSWJnnNY8R5+WnRYLnaVyXbifKC2cGdVk6Njh3EY2RhrnUbPIrSjlDhmabHVYfCIGm3PFgaC9lrQyjQNb4b3C58sFbotBvjbJrQlpC5xzc4r2Ejk8UJyu6D4T7cllYLsQ95IcS2jVn8gvTxHlNHQqzFhwTdLsd/JzpL4OCwv6NYf25pD5NDQPstdv6P8LVZSfN2p+i7FjFZYEHbYyfHSPMuJ/o5gI8GZh6tNt9wVxfEezeKwsuRrDIHDwujFgjzHIr6FDRzCrT8La+6FOrRw/MI20gWeCYbsVjXi+7a3ye8A6+lqYdlsfCLbGHDchjg4/I0vbcL2bym+99QBofmVdj4LGDY39FnOTW0BUumeEcOgmlJaIJMw3GR2/qQrPGOGT4eAzSRlo0Hi6nQL3UYADY/RcR237DYvGvDmzsMTRpES9gvqdwT8lFY1ytovCbl9tr92eINUgK3uNdiMdhyXPwz+7BPiZUjAOpLLoetLnmFdykmjlnicXs9J/RFinO7/AAzXZZAWzRkjM06d29rhzH+75j6LuOKXYDtHOY4GhpQDjfp5H6rxLs/xaTCziaJ2V2UtOltc00crh0sDbXRepxY2aVjZZSQTEDlAIAvWgXbaV1XPOP32dWNv6RNhpRHQGgFaXeu5s1qVs4PiQ57ea5D8S54N3dE7DTNeX3po6aqaJxbzP+i556do6cXtpneyYuJzfHRHOzftSxD+Ba8ZYgXudQDbcb/haTQ9lxPF+0LWO7oON0M1bi/LqreGxrIovxMLiZGnQu13sEXy0tZxlLdGuEdWej4DCNa4ZG1XIiiuV7XcDbLii9r2tke0Bod8LshJ9qzJ3Z/tn37sj2U8NsFpvNQ1vQUfLms/jXaGN0uVvifG5pJH7B8QIvrR29FpJpUgR7tszoOxsjXZ5BHQN+HX3ugubhxXdYqZmRz5GzSaAE6FxIquVUu+dxmm67EWPQqzhIQ7Cl7GgPfmL3AAOcQSNSNzQA9loO9MGb7No84xPGpJHU0Buuyu8NwTrDnmz9Fn47gkjMS57hluT2GZuZo+hXR8PNDxbjdDIktIGJ8lbM7tMxvcuzGgG6evILluH8DmnZ3scbnxsdlf3erxpY8O59lf7QcXink7vxd013xs1JPPwnQheo/o/wCz/wCFwxJJJmIkpwALRlAAI5GleF44b7Zy5ZKeTXg8lw8Yj8PnqHbokfI6QZDTARYHNevdouyGGxRLy0slr449Cf7Q2cvPsZ2TmwsuaQd5BydGD7Zm8kMf3yr5HlkSiUbQtTu2fuv+SF0/kH8nP+ZR63Jhw8UdxsVXbo7J0+60I1Fi4dQ/2P5JJIEX4BgUrVG1TQCz6JRiaKO9SpgQmvKRiNC3ZLaVNCVNQgtoCEI8bNY4Liu1v6OMLjM0sQEGJOudg/VvP/EjGn8wo+q7O0torGwc0eadjP0bjCl+Kx+R8sbXmFjDniblBPfOseJ2nhFab71Wo5rp8M2Q+Ivha5xJui5oNb6a/NdTxx5GGlDficwxt83SeAf8y5zhzO6Z3B/8sZPTJ4TXlolyaoti2mzlZIHiuQbmLqF2Ab/L5gqRjSzxWCAfAHUCSSKBOugBBoLX4pAaLGAAu3Jr0vU66D6+S43G8Ny5QZTQtjXEE8gD3bedWdRvfMqaxplfrNFPC8C/FTSPvUSAAknK4ZWmjW2/LougdwgsjySZmjxUfjj+EAWRRafMjpundn42xSuhcSNRoR4mlwunECsx1012K0u0GMlgaSWh8RG56GuY9dlNykpUWjGMo2cVxngpLnyGWMtFftsO2XQVRNjyHoufxbg1pETXgtfV0A0g7AAa73XkV0eJ4m1z+7MZ3I8JBojcHooeKMAyta0CnB1eYIIv5Kim06aEljhXJMu4DFvbFExzc0uQAAi/EdhXNex8K4OyLDxwuFuawZjZ1edXH+8SuI/R5wnvZvxUjfDG0ZbGhksgEHnQr5r0oIRgvJHLlbao53ivZGGZ5kzOa4sykaOYdbBrqORvmVzXHuxswhe1niJYQHNu/Ujf5WvRykWliT2CGaUdHkfBv0YMa6GR82fK8GUZaY6tQ1g33q7816a4UPZWZIgfVV3ncc1LJyb2GNeCq7VV8TGCCDqKUubruFXkdfoPulQWY/8AsSLokWnmQrfVn8icI/Bhx/pBi5wSf3m/4puI7dSPbUOFPXM990B5AfmsfC1yy2PIK+ZNCNKo7f5LleefyfTr0Hpk9Q/lnbxPtoPUA/NX4m5RXNcf2Gxkk+bO62R00CufmefJdo0LrhLkrPnvVYXgyPG30AbzKLS0T6J7RStGNnK3QAIQhVUUibkLaRCE1C2CVIhYxXxIzSRt5BxkP8opv/6df8q5rtSDDOJK/Vyjfo9opw9xR+a6iNn6xz+eVrR6Akn6lRcVwDZ4XRO0seE18Lh8Lv65EqGWHKLL4ZqMlZxIxTJCLOvIkZq865/5KlPwdwf3t24ghrtw23DVosjYnpz0Cz8VA+CZzH2HMdRo6XuDfMEUfQrW4fijz2OmnQ7rkhlrTO6eBNXEj4Ngmk94asutpcaJL7YC7Syaoneyb1Te0GJLojWxlIo0RTXMygNrofTRaLwGjNGPFoBrppQF+gvdZPFXySsyMjABO9gu1BJrkNh9la0yCUomFEM8wLWgkyEZgN3GhVjfQj5rfwPZR02LDifC1vjJbpWYEEHnbQ4e/qo8Bho4C2R9kxNdIASDWRoLiWjU7HXbnzXo+AZkaGnfQu/tULTRjsSc20WMDhWRMEcbcrANB+Z81OE0JVXj8EOXyLaRc5xjtQcK/LNhZKJ8L2FronejrGvkdVmu7ftr/uz75W5oH+P0XPLNBOmz0Mf4b6nIlKMbX7r+zsJHKCZuYfxDY/1yXF/9vHn/ANNfo/8AxCmZ2401wsl+TmlReaEvJ0f4r1Mf9f5X9mhi5nZwHANOxrVSXp/DyvclYsPHvxEwuEsGU7uBLj7bLYHU+gHK/wDJCLT6OXNhnilxmqY2ikRk80JiJwrIfIH5KyIwSAWhum+te4tehOwMT/ijafYWqGK7J4d2ozs65HGvram/TSXR7uP8Wxv3popfoziqCR13cx1HkAuzaue7F4QRYcsGwkfV71elrowurBD7UjxvX5VPPKS+QQhC7DzwQhCxgQhCxgQhCxhGir8ylJQgoNBT2cb22ww7yOYDR7Cx3qw233pxH8oXNPiI1YV6XjcK2Rpa5uZp3H5g8j5hcdxThJiOhJYT4Sd/7J8/uvOzYmnZ6np8qao5+bESjYjbnqub4jjMVK8RxyPL3GmsiAFk8tN/fZdZNhnPcGMGZ7jQA/rbmt/gnZ1kHi3lPxSDfzZGeQ89/wAlxRd6KZZpIzOGcE/DYWOInNPNNDHM91uNPkaJGA+UYeOg15krvIjZ9SsLEMa7EYdmwa6SRrRp8EeTboO++y3YBqu6J58i40JUgKVVRzvsSSNrmlrgHNO4cLB9QVxHaPsYQDJhBmG5iJ8QH/DPP+ydfM7LuEqllwwyKmjr9J63L6aXKD/54Z4rHJW7Td8709VMyQ+Q+f5rt+1/AHPcJ8OzM9xqVjSBfR4vS+R9vNcy7guK/wDbPPoWH6Zl5E8MoSo+wwevxZsanaV+G0M4c4h7X6AAjWxVHQrsQNL+XouOHCMRzw03uGAfddVHLTAXA6gaAWdvJUxJrTPI/FuMpRlFp/sTUPNCr/7QZ+4/+6UKx49G1Gp3nwn0KrRlPmd4Hf2T9l1EiHs2SYWuNa2dNBuaWwFmcAiy4aMHcsB+a0gqYVUSeV3IVCEKpMEIQsYEIQsYEyeVrGOe801oJJ1NAeQUio8ZaTCWj9p8YN9DI2/paF60FItxvDgHNNgiwRsQnJI/hB0HhGg2Gmw8kq0XaM1TI3FQ4jDNka5rhoRR/IjzvVWSEhGhpI1q2UUq6MHhnCmwtJNGQinP8v3W9G/f5BWGtV2WDwqMRqMVS0dDlbtkMUY3rXl18/yVyEKOOP7n+vorUbKCaL2Tl0OCVCF0HMCVIhBmQpUT1IVG8qM0mrKxdOivKdNx77rHkytHLZa850PouE4txmMtIY8EbWNQuaS2XXRpfjR+8ELksz/3glQo2z0qIqSVuZpaOenzUERVqMrq4MhySLTBWg2AAHoFKFAwqUFXSokSISBKsYEIRSDZgtCEJfc7H6QKHGjwE/uuY830jka8j5NI91Miuu3NNQpT4S492WO+KOSSM3uQxxDT7tyH3VxUOHQvY5zXZnDI23mg1xYAGka7kHXTdqvoQ6DLsVFJEIcbNyoSQaKrjc4jd3YDpcpyNcaaXV4QTyFq2qXE5S2N727sie8erWkj7LSSSGi22Q9nsU6fDRzubkc8OJaDYBD3Nq/5VqKpwvBthhZFH8DG0Nb3JJ19SVaSRoMrYISoVOSJ8WIkJ6JUiWbfQ0F5BQuKfK7Shuf6tRu6JP0HfyVMbJTHHoxx+QK+cMBjJZJ4hmNOlZbW6DcbjnovofjMlQSnpC8/JpXzThp3MLJGaOaWkeoS4knYZvo9c/BD95Ci/H/wn5FCFBs7qJytxuWbC5XInLqsg0XmFTtKqRuU7HLALAKcFECngoPoKHIQUKTY9AhKkVI9CPsEIQmACEIWMKkKUJElbdDXrYpWZ2gDvwk+Su8dE5jL2DnjICfIZr9lpKvjMPnyjSgaIcC5pa7RwqwLrmbr3KEgr5LDWBoDRs0Bo9Gih9kqCkTpKhWxUJEWlcAqRHNJSM+nmmYrb3CcNAo27K0qGvUbz9k4nmq5dpfVMgMyu08lYTEHph5P+Qr534dCXyRsAsl7RQ6WCfoCvojj2EdNh5YWEB0kT2AuvKC5pFmvVed9m+wOIw0/ezSREBhDe7c8mzW4LBytaCpM0t0dHTEKx/s53Vv1QlphtGhDIrsT1kRvV6GRWh0Sl2acb1ZY5Z8b1ZY5PYKLzSpGlVWOUrXqbmMokvNPBVZk2tKwClWx5aHISWltWIghCFjAhCFjChIlQlXkZ+BEFKkQittmb0CEJLTiipEhKaXJZMZIjkP3QSo81lDnqCKsZK7kq07/ALqR7lRnf4q6J0KOleqUz1JLIqU0iquib7FzpVV7xCJiCOVXsPKsaKRXIZUq0M1ZtxvViN6zIZVbjkQlTNFtGlG/zUocqLHKUSqbVFIj8n67MNyzxdKB0+5WgJFkYfEiyep+g2VpuICWLoaUbLwcnhyojEDoU4YnyKPIHAv2ltVGYgKVsidZPkR4yZCjD061RSTJuLQ5Fptotbjqmax1pLTbSZkQD7TSU0uTC9JJPwMmhznKJ79EPes/iOIytrm52Ue4JP0BUpMrFInhkuz8vRD3qnC/TROe8oQ/U0xZZVSLuadNJyVPEvsUE72xV0LJLoqU0iWSRUppUdgJO8QqfeIQo1lWKdXoZwsOCYq/DMPJUBRsxYgeSvRTA81iROHl8lcjI5fZI0x00bLHnqoeKxyvhdHFo5/hzA0WtPxEGxrVjTqq0L3eStMmrc6pWFOiHheKljcYZgHFtU7QOII51oenst2Kdp5V6rJjIc8u6AD7n81dFIQXwGTRpNITwR0Wa2xsVPHP1VNeUTp+GXKb0Sho5KASIof6IcQ8v1LVeaUOVUE8nfNNOIcNx8kNLwHbL2ZJmVAY0ef3T24xp/aH2+6ZZF5FeNlsuTS5Q94mGUdU/JfInFk5emOeoDKOqjfMEHJB4smkloLmu0fEMsuHbyMpcT/KWge+Y/JasstrMw+OjmdJHWsb8rmSDcfsvAPI8ioTdloqjRixAITJZeirFgbtYHz+qglm6IxtIV02OlkIVKWZ3RJLivPXy1VV8pRSCx8knUqlNKmS4jWgqs0qYmS96hUu9QiYgjV/DIQixl0X4VciSoRJlpuyRm6RCnMrAt8N2d/8jvutFqEIYuwZCVqkQhWfQkeyRieEIQj0aXY4JShC0+gx7KU6pPQhczOpFjh6nehCAvkjcq3MoQsjAVgO/wDEj/8AU/62oQixTWes7G7JUKr6ERUh2UOIQhNEWRmjmoJUIQNLsroQhEB//9k="
                            alt="Profile"
                            sx={{
                                width: 160,
                                height: 170,
                                margin: "10px auto",
                                borderRadius: 2,
                            }}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: "bold",
                                color: "#fff",
                                background: "#001F54",
                                padding: "5px",
                                borderRadius: "5px",
                                wordBreak: "break-word", // Handles long names properly
                            }}
                        >
                            {name}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
                            {id}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#555" }}>
                            📍 {project}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ mt: 2, fontWeight: "bold", color: "#001F54" }}
                        >
                            Emergency No. {emergencyNumber}
                        </Typography>
                    </Card>
                </Grid>

                {/* Back Side */}
                <Grid item xs={6} sx={{ display: "flex" }}>
                    <Card
                        sx={{
                            border: "2px solid #001F54",
                            borderRadius: 2,
                            padding: 2,
                            width: "100%",
                            maxWidth: "350px",
                            display: "flex",
                            flexDirection: "column",
                            minHeight: "100%", // Ensures equal height
                        }}
                    >

                        <CardContent sx={{ flexGrow: 1 }}>
                            <Table sx={{ "& td": { borderBottom: "none", padding: "4px 8px" } }}>
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ color: "#001F54", fontWeight: "bold" }}>D.O.B.</TableCell>
                                        <TableCell>: {dob}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ color: "#001F54", fontWeight: "bold" }}>Date Of Joining</TableCell>
                                        <TableCell>: {joiningDate}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ color: "#001F54", fontWeight: "bold" }}>Dept.</TableCell>
                                        <TableCell>: {department}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ color: "#001F54", fontWeight: "bold" }}>Designation</TableCell>
                                        <TableCell>: {designation}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ color: "#001F54", fontWeight: "bold" }}>Induction Date</TableCell>
                                        <TableCell>: {inductionDate}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ color: "#001F54", fontWeight: "bold" }}>Induction By</TableCell>
                                        <TableCell sx={{ whiteSpace: "pre-line" }}>: {inductionBy}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ color: "#001F54", fontWeight: "bold" }}>Aadhaar No.</TableCell>
                                        <TableCell>: {aadhaar}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ color: "#001F54", fontWeight: "bold" }}>Valid Upto</TableCell>
                                        <TableCell>: {validUpto}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>


                        {/* Space for Signature */}
                        <Box
                            sx={{
                                textAlign: "center",
                                mt: 4,
                                mb: 1,
                                minHeight: "40px",
                                backgroundColor: '#e2e7fd',
                                width: "80%",
                                margin: "0 auto",
                            }}
                        >

                        </Box>

                        {/* Issuing Authority Box */}
                        <Box
                            sx={{
                                textAlign: "center",
                                backgroundColor: "#001F54",
                                padding: "8px",
                                borderRadius: "5px",
                                color: "#fff",
                                width: "90%",
                                margin: "auto",
                            }}
                        >
                            Issuing Authority
                        </Box>

                        {/* Return Note */}
                        <Typography
                            variant="caption"
                            sx={{
                                mt: 1,
                                display: "block",
                                textAlign: "center",
                            }}
                        >
                            If found, please return to the company
                        </Typography>

                        {/* Company Name */}
                        <Box
                            sx={{
                                backgroundColor: "#001F54",
                                padding: "8px",
                                borderRadius: "5px",
                                textAlign: "center",
                                color: "#fff",
                                mt: 1,
                                width: "95%",
                            }}
                        >
                            YOUR COMPANY NAME
                        </Box>

                        {/* Company Address */}
                        <Typography
                            variant="caption"
                            sx={{
                                display: "block",
                                textAlign: "center",
                                mt: 1,
                                paddingX: 1,
                                wordBreak: "break-word",
                            }}
                        >
                            Vilas Javdekar Developers - KOTHRUD Corporate Office 306,
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LabourIdCard;
